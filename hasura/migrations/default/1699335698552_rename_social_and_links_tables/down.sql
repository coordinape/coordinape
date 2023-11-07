
alter table "public"."link_tx" rename column "target_fee_amount" to "subject_fee_amount";

alter table "public"."link_tx" rename column "link_amount" to "share_amount";

alter table "public"."link_tx" rename column "target" to "subject";

alter table "public"."link_tx" rename column "holder" to "trader";

alter table "public"."link_tx" rename to "key_tx";

alter table "public"."link_holders" rename column "holder" to "address";

alter table "public"."link_holders" rename column "target" to "subject";

alter table "public"."link_holders" rename to "key_holders";

alter table "public"."twitter_accounts" rename to "twitter_account";

alter table "public"."linkedin_accounts" rename to "linkedin_account";

alter table "public"."github_accounts" rename to "github_account";
