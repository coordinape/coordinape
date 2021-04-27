import { MenuItem, Select, makeStyles } from '@material-ui/core';
import { useUserInfo } from 'contexts';
import { forceLink } from 'd3-force-3d';
import fromPairs from 'lodash/fromPairs';
import uniq from 'lodash/uniq';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import AutoSizer from 'react-virtualized-auto-sizer';
import { getApiService } from 'services/api';
import { ITokenGift, IUser } from 'types';
import { IEpoch } from 'types/models/epoch.model';

const NODE_R = 8;

// TODO: XSS vulnerability on node labels:
// https://github.com/vasturiano/force-graph/issues/20

// TODO: Move to theme
const COLOR_NODE_HIGHLIGHT = '#13a2cc';
const COLOR_GIVE = '#00ce2c';
const COLOR_RECEIVE = '#d3860d';
const COLOR_CIRCULATE = '#c9b508';
const COLOR_NODE = '#000000';
const COLOR_GIVE_LINK = '#00ce2c80';
const COLOR_RECEIVE_LINK = '#d3860d80';
const COLOR_LINK = '#00000010';
const COLOR_LINK_DIM = '#00000004';

const showMagnitudes = () => true;

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    height: '100%',
  },
  autoSizer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  controls: {
    padding: theme.spacing(2, 4),
    position: 'absolute',
    top: 0,
    right: 0,
  },
  epochSelectRoot: {
    fontSize: 20,
    fontWeight: 700,
    color: theme.colors.red,
    '&:hover': {
      '&::before': {
        borderBottomColor: `${theme.colors.red} !important`,
      },
    },
    '&::after': {
      borderBottomColor: `${theme.colors.transparent} !important`,
    },
  },
  epochSelect: {
    color: theme.colors.red,
  },
  epochSelectIcon: {
    fill: theme.colors.red,
  },
  epochSelectMenuPaper: {
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), #FFFFFF',
  },
  epochMenuItem: {
    fontSize: 18,
    fontWeight: 500,
    color: theme.colors.text,
  },
  epochMenuItemSelected: {
    background: `${theme.colors.third} !important`,
  },
}));

interface IEpochOption {
  label: string;
  value: number;
}

interface ILink {
  source: number;
  target: number;
  width: number;
  curvature: number;
  tokens: number;
}

interface IProps {
  className?: string;
}

function linkStrengthToken(link: any) {
  return 0.2 / link.tokens;
}

function linkStrengthCounts(link: any) {
  return 0.5 / (link.source.linkCount + link.target.linkCount);
}

function labelEpoch(epoch: IEpoch) {
  const start = new Date(epoch.start_date);
  const end = new Date(epoch.end_date);
  if (start.getMonth() !== end.getMonth()) {
    const formatter = new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'short',
    });
    return `${formatter.format(start)} - ${formatter.format(end)}`;
  }
  const dayFormatter = new Intl.DateTimeFormat('en', {
    day: 'numeric',
  });
  const month = new Intl.DateTimeFormat('en', {
    month: 'long',
  }).format(start);
  return `${month} ${dayFormatter.format(start)} - ${dayFormatter.format(end)}`;
}

const GraphPage = (props: IProps) => {
  const fgRef = useRef<any>(null);
  const hoverNode = useRef<any>(null);
  const highlightReceiveNodes = useRef<Set<any>>(new Set());
  const highlightGiveNodes = useRef<Set<any>>(new Set());
  const highlightReceiveLinks = useRef<Set<any>>(new Set());
  const highlightGiveLinks = useRef<Set<any>>(new Set());

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [pastGifts, setPastGifts] = useState<ITokenGift[]>([]);
  const [pendingGifts, setPendingGifts] = useState<ITokenGift[]>([]);

  const [gifts, setGifts] = useState<ITokenGift[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);
  const [epochOptions, setEpochOptions] = useState<IEpochOption[]>([]);
  const [epochSelection, setEpochSelection] = useState<number>(0);
  const { epoch, epochs, me, users } = useUserInfo();

  console.log('loggins', epochOptions, epochSelection);

  const fetchGifts = async () => {
    try {
      const [pending, past] = await Promise.all([
        getApiService().getPendingTokenGifts(
          undefined,
          undefined,
          me?.circle_id
        ),
        getApiService().getTokenGifts(undefined, undefined, me?.circle_id),
      ]);
      setPastGifts(past);
      setPendingGifts(pending);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || 'Something went wrong!',
        { variant: 'error' }
      );
      setPastGifts([]);
      setPendingGifts([]);
    }
  };

  const configureForces = () => {
    const fl = forceLink().strength(
      showMagnitudes() ? linkStrengthToken : linkStrengthCounts
    );
    fgRef.current.d3Force('link', fl);
  };

  const nodeCanvasObject = useCallback((node: any, ctx: any) => {
    const centX = node.x;
    const centY = node.y;
    let strokeColor = COLOR_NODE;
    const width = showMagnitudes()
      ? Math.min(Math.max(0.5, node.tokensReceived / 50), 6)
      : 1;
    if (node === hoverNode.current) strokeColor = COLOR_NODE_HIGHLIGHT;
    if (highlightGiveNodes.current.has(node)) strokeColor = COLOR_GIVE;
    if (highlightReceiveNodes.current.has(node)) strokeColor = COLOR_RECEIVE;
    if (
      highlightReceiveNodes.current.has(node) &&
      highlightGiveNodes.current.has(node)
    )
      strokeColor = COLOR_CIRCULATE;

    ctx.beginPath();
    ctx.arc(node.x, node.y, NODE_R + 0.5 * width, 0, 2 * Math.PI);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.closePath();

    ctx.save();
    ctx.beginPath();
    ctx.arc(node.x, node.y, NODE_R, 0, 2 * Math.PI);
    ctx.fillStyle = COLOR_NODE;
    ctx.fill();
    ctx.clip();

    try {
      ctx.drawImage(
        node.img,
        centX - NODE_R,
        centY - NODE_R,
        NODE_R * 2,
        NODE_R * 2
      );
    } catch (error) {
      // console.error(node.avatar);
    }
    ctx.restore();
  }, []);

  const linkColor = useCallback((link: any) => {
    let color = hoverNode.current ? COLOR_LINK_DIM : COLOR_LINK;
    if (highlightReceiveLinks.current.has(link)) color = COLOR_RECEIVE_LINK;
    if (highlightGiveLinks.current.has(link)) color = COLOR_GIVE_LINK;
    return color;
  }, []);

  const linkDirectionalParticleWidth = useCallback(
    (link: any) => {
      if (
        highlightReceiveLinks.current.has(link) ||
        highlightGiveLinks.current.has(link)
      ) {
        return showMagnitudes() ? Math.max(link.tokens / 10, 3) : 4;
      }
      return 0;
    },
    [epochSelection]
  );

  const getWidth = (link: any) => (showMagnitudes() ? link.width : 4);

  const onNodeClick = useCallback((node: any) => {
    highlightReceiveNodes.current.clear();
    highlightGiveNodes.current.clear();
    highlightReceiveLinks.current.clear();
    highlightGiveLinks.current.clear();
    if (node === hoverNode.current) {
      hoverNode.current = null;
      return;
    }
    if (node) {
      node.receivers.forEach((other: any) =>
        highlightReceiveNodes.current.add(other)
      );
      node.givers.forEach((other: any) =>
        highlightGiveNodes.current.add(other)
      );
      node.giverLinks.forEach((l: ILink) => highlightGiveLinks.current.add(l));
      node.receiverLinks.forEach((l: ILink) =>
        highlightReceiveLinks.current.add(l)
      );
      hoverNode.current = node;
    }
  }, []);

  useEffect(() => {
    if (epochs.length === 0) {
      setEpochOptions([]);
      setEpochSelection(0);
      return;
    }
    setEpochOptions(
      epochs.map((e) => ({
        label: labelEpoch(e),
        value: e.id,
      }))
    );
    setEpochSelection(epoch?.id ?? epochs[0].id);
  }, [epoch, epochs]);

  useEffect(() => {
    me && fetchGifts();
  }, [me]);

  useEffect(() => {
    setGifts(
      epochSelection === epoch?.id
        ? pendingGifts
        : pastGifts.filter((g) => g.epoch_id === epochSelection)
    );
    // Set magnitudes here if desired
  }, [epochSelection, pastGifts, pendingGifts, epoch]);

  useEffect(() => {
    if (!fgRef.current) {
      return;
    }

    if (gifts.length === 0 || users.length === 0 || !me) {
      setLinks([]);
      setNodes([]);
      return;
    }

    const activeUsers = uniq(
      gifts.flatMap(({ recipient_id, sender_id, tokens }) =>
        tokens > 0 ? [sender_id, recipient_id] : []
      )
    );

    const images = fromPairs(
      uniq(users.concat(me).map((u) => u.avatar)).map((avatar) => {
        const img = new Image();
        img.src = avatar
          ? (process.env.REACT_APP_S3_BASE_URL as string) + avatar
          : '/imgs/avatar/placeholder.jpg';
        return [avatar ?? '/imgs/avatar/placeholder.jpg', img];
      })
    );

    const allUsers = users
      .concat(me)
      .filter((u) => activeUsers.find((id) => u.id === id) !== undefined)
      .map((u) => ({
        ...u,
        img: images[u.avatar ?? '/imgs/avatar/placeholder.jpg'],
        receiverLinks: [] as any,
        giverLinks: [] as any,
        givers: [] as any,
        receivers: [] as any,
        tokensReceived: 0,
        linkCount: 0,
      }));

    const userByAddr: { [key: string]: IUser } = {};
    const userById: { [key: number]: IUser } = {};
    const orderedIdByAddr: { [key: string]: number } = {};
    const orderedId: { [key: number]: number } = {};
    const names: string[] = [];
    const matrix: number[][] = [];

    for (let i = 0; i < allUsers.length; i++) {
      const user = allUsers[i];
      userByAddr[user.address] = user;
      userById[user.id] = user;
      orderedIdByAddr[user.address] = i;
      orderedId[user.id] = i;
      names[i] = user.name.replace(/\([^)]*\)/, '');
    }

    for (let i = 0; i < allUsers.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < allUsers.length; j++) {
        matrix[i][j] = 0;
      }
    }

    for (const { recipient_id, sender_id, tokens } of gifts) {
      if (tokens > 0)
        matrix[orderedId[sender_id]][orderedId[recipient_id]] = tokens;
    }

    // Using the DB id for links, rather than orderedId
    const links = gifts
      .filter(({ tokens }) => tokens > 0)
      .map(({ recipient_id, sender_id, tokens }) => ({
        source: sender_id,
        target: recipient_id,
        width: tokens / 3,
        tokens,
        curvature:
          matrix[orderedId[recipient_id]][orderedId[sender_id]] > 0 ? 0.1 : 0,
      }));

    for (let i = 0; i < allUsers.length; i++) {
      const me = allUsers[i];
      // Giving to me
      me.giverLinks = links.filter((link) => link.target === me.id);
      me.givers = me.giverLinks.map((l: ILink) => userById[l.source]);
      // Receiving from me
      me.receiverLinks = links.filter((link) => link.source === me.id);
      me.receivers = me.receiverLinks.map((l: ILink) => userById[l.target]);
      ////
      me.linkCount = me.giverLinks.length + me.receiverLinks.length;
      me.tokensReceived = me.giverLinks.reduce(
        (c: number, l: ILink) => c + l.tokens,
        0
      );
    }

    configureForces();
    setLinks(links);
    setNodes(allUsers);
  }, [gifts, users, me]);

  return (
    <div className={classes.root}>
      <AutoSizer className={classes.autoSizer}>
        {({ height, width }) => (
          <ForceGraph2D
            graphData={{ nodes, links }}
            height={height}
            linkColor={linkColor}
            linkCurvature="curvature"
            linkDirectionalParticleWidth={linkDirectionalParticleWidth}
            linkDirectionalParticles={4}
            linkWidth={getWidth}
            nodeCanvasObject={nodeCanvasObject}
            nodeRelSize={NODE_R}
            onNodeClick={onNodeClick}
            ref={fgRef}
            width={width}
          />
        )}
      </AutoSizer>
      <div className={classes.controls}>
        <Select
          MenuProps={{
            classes: {
              paper: classes.epochSelectMenuPaper,
            },
          }}
          className={classes.epochSelectRoot}
          classes={{
            select: classes.epochSelect,
            icon: classes.epochSelectIcon,
          }}
          onChange={({ target: { value } }) =>
            setEpochSelection(value as number)
          }
          value={epochSelection}
        >
          {Object.values(epochOptions).map(({ label, value }) => (
            <MenuItem
              className={classes.epochMenuItem}
              classes={{ selected: classes.epochMenuItemSelected }}
              key={value}
              value={value}
            >
              {label}
            </MenuItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default GraphPage;
