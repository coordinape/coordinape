alter table distributions alter column total_amount type varchar;
update distributions set total_amount = replace(total_amount, '.0', '');