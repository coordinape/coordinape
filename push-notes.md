# TODO

- Add ErrorBoundary and enqueueSnackbar when errors
- user.starting_tokens - user.give_token_remaining
- axios.defaults.baseURL = getCirclePath(prevCircle.id) no longer
- How to you localStorage to remember circle?

```javascript
useEffect(() => {
  if (window.location.search === AUTO_OPEN_WALLET_DIALOG_PARAMS) {
    toggleWalletConnectModal();
  }
}, []);
```

- Still need a redirect if you sneak into the admin page
- First time "Sorry you have no authorized Circles" before wallet connect - no
- remove RecoilizeDebugger

## What to dao with this?????

```javascript
// refreshUserInfo
if (me.circle_id !== state.circle.id) {
  me.teammates = users.filter(
    (user) =>
      user.address.toLowerCase() !== account?.toLowerCase() && !user.deleted_at
  );
  me.pending_sent_gifts = [];
  me.role = 0;
  me.non_giver = 1;
}

if (!me.fixed_non_receiver) {
  storage.removeForceOptOutCircleId(me.id, state.circle.id);
}
```
