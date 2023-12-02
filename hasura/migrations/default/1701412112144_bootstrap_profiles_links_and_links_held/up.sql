update profiles p set links=(select COALESCE(sum(amount),0) from link_holders lh where lh.target ilike p.address);
update profiles p set links_held=(select COALESCE(sum(amount),0) from link_holders lh where lh.holder ilike p.address);
