update profiles p set links=(select sum(amount) from link_holders lh where lh.target ilike p.address);
update profiles p set links_held=(select sum(amount) from link_holders lh where lh.holder ilike p.address);
