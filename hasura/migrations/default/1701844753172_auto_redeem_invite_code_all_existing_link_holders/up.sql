update profiles p set invite_code_redeemed_at=now() where LOWER(p.address) in (select distinct LOWER(target) from link_holders);
