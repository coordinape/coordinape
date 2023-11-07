
alter table "public"."github_account" rename to "github_accounts";

alter table "public"."linkedin_account" rename to "linkedin_accounts";

alter table "public"."twitter_account" rename to "twitter_accounts";

alter table "public"."key_holders" rename to "link_holders";

alter table "public"."link_holders" rename column "subject" to "target";

alter table "public"."link_holders" rename column "address" to "holder";

alter table "public"."key_tx" rename to "link_tx";

alter table "public"."link_tx" rename column "trader" to "holder";

alter table "public"."link_tx" rename column "subject" to "target";

alter table "public"."link_tx" rename column "share_amount" to "link_amount";

alter table "public"."link_tx" rename column "subject_fee_amount" to "target_fee_amount";
