import { makeStyles } from '@material-ui/core';
import { useUserInfo } from 'contexts';
import { forceLink } from 'd3-force-3d';
import fromPairs from 'lodash/fromPairs';
import uniq from 'lodash/uniq';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { getApiService } from 'services/api';
import { ITokenGift, IUser } from 'types';

const NODE_R = 8;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  },
}));

interface ILink {
  source: number;
  target: number;
  width: number;
  curvature: number;
}

interface IProps {
  className?: string;
}

const getWidth = (link: any) => link.width;

function linkStrength(link: any) {
  // Default: 1 / count;
  return 0.1 / link.tokens;
}

const GraphPage = (props: IProps) => {
  const fgRef = useRef();
  const hoverNode = useRef<any>(null);
  const highlightReceiveNodes = useRef<Set<any>>(new Set());
  const highlightGiveNodes = useRef<Set<any>>(new Set());
  const highlightReceiveLinks = useRef<Set<any>>(new Set());
  const highlightGiveLinks = useRef<Set<any>>(new Set());

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [gifts, setGifts] = useState<ITokenGift[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);
  const { me, refreshUserInfo, users } = useUserInfo();

  const fetchGifts = async () => {
    try {
      const allGifts = await getApiService().getPendingTokenGifts();
      setGifts(allGifts);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || 'Something went wrong!',
        { variant: 'error' }
      );
      setGifts([]);
    }
  };

  const configureForces = () => {
    const fg: any = fgRef.current;
    const fl = forceLink().strength(linkStrength);
    fg.d3Force('link', fl);
  };

  const initialize = () => {
    if (gifts.length === 0 || users.length === 0 || !me) {
      return;
    }

    const images = fromPairs(
      uniq(users.concat(me).map((u) => u.avatar)).map((avatar) => {
        const img = new Image();
        img.src = avatar;
        return [avatar ?? '', img];
      })
    );

    const allUsers = users.concat(me).map((u) => ({
      ...u,
      img: images[u.avatar ?? ''],
      receiverLinks: [] as any,
      giverLinks: [] as any,
      givers: [] as any,
      receivers: [] as any,
      received: 0,
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
    }

    configureForces();
    setLinks(links);
    setNodes(allUsers);
  };

  const nodeCanvasObject = useCallback((node: any, ctx: any) => {
    const centX = node.x; // Math.floor(node.x);
    const centY = node.y; // Math.floor(node.y);
    let strokeColor = 'black';
    const width = Math.min(Math.max(2, node.give_token_received / 20), 5);
    if (node === hoverNode.current) strokeColor = '#239ab4';
    if (highlightGiveNodes.current.has(node)) strokeColor = '#2cc517';
    if (highlightReceiveNodes.current.has(node)) strokeColor = '#741faf';

    ctx.beginPath();
    ctx.arc(node.x, node.y, NODE_R + 0.5 * width, 0, 2 * Math.PI);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.closePath();

    ctx.save();
    ctx.beginPath();
    ctx.arc(node.x, node.y, NODE_R, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
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
    let color = '#00000010';
    if (highlightReceiveLinks.current.has(link)) color = '#741faf50';
    if (highlightGiveLinks.current.has(link)) color = '#2cc51750';
    return color;
  }, []);

  const linkDirectionalParticleWidth = useCallback(
    (link: any) =>
      highlightReceiveLinks.current.has(link) ||
      highlightGiveLinks.current.has(link)
        ? Math.max(link.tokens / 10, 3)
        : 0,
    []
  );

  // const nodeCanvasObjectMode = (node: any) =>
  //   !highlightNodes.current.has(node) ? 'before' : 'replace';

  const onNodeClick = useCallback((node: any) => {
    highlightReceiveNodes.current.clear();
    highlightGiveNodes.current.clear();
    highlightReceiveLinks.current.clear();
    highlightGiveLinks.current.clear();
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
    }

    hoverNode.current = node || null;
  }, []);

  useEffect(() => {
    fetchGifts();
  }, []);

  useEffect(() => {
    initialize();
  }, [gifts, users, me]);

  return (
    <div className={classes.root}>
      <ForceGraph2D
        graphData={{ nodes, links }}
        linkColor={linkColor}
        linkCurvature="curvature"
        linkDirectionalParticleWidth={linkDirectionalParticleWidth}
        linkDirectionalParticles={4}
        linkWidth={getWidth}
        nodeCanvasObject={nodeCanvasObject}
        nodeRelSize={NODE_R}
        onNodeClick={onNodeClick}
        ref={fgRef}
      />
    </div>
  );
};
//linkDirectionalArrowLength={6}
export default GraphPage;
