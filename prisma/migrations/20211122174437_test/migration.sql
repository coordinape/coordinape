-- CreateTable
CREATE TABLE "circle_metadata" (
    "id" BIGSERIAL NOT NULL,
    "circle_id" BIGINT NOT NULL,
    "json" JSON,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "circle_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "circles" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(510) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "protocol_id" INTEGER,
    "token_name" VARCHAR(510) NOT NULL DEFAULT E'GIVE',
    "team_sel_text" TEXT,
    "alloc_text" TEXT,
    "telegram_id" VARCHAR(510),
    "logo" VARCHAR(510),
    "vouching" BOOLEAN NOT NULL DEFAULT false,
    "min_vouches" INTEGER NOT NULL DEFAULT 2,
    "nomination_days_limit" INTEGER NOT NULL DEFAULT 14,
    "vouching_text" TEXT,
    "default_opt_in" BOOLEAN NOT NULL DEFAULT false,
    "team_selection" BOOLEAN NOT NULL DEFAULT true,
    "discord_webhook" VARCHAR(510),
    "only_giver_vouch" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "circles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "epoches" (
    "id" BIGSERIAL NOT NULL,
    "number" INTEGER,
    "start_date" TIMESTAMPTZ(6),
    "end_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "circle_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ended" BOOLEAN NOT NULL DEFAULT false,
    "notified_start" TIMESTAMP(6),
    "notified_before_end" TIMESTAMP(6),
    "notified_end" TIMESTAMP(6),
    "grant" DECIMAL(20,2) NOT NULL DEFAULT 0.00,
    "regift_days" INTEGER NOT NULL DEFAULT 1,
    "days" INTEGER,
    "repeat" INTEGER NOT NULL DEFAULT 0,
    "repeat_day_of_month" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "epoches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "failed_jobs" (
    "id" BIGSERIAL NOT NULL,
    "uuid" VARCHAR(510) NOT NULL,
    "connection" TEXT NOT NULL,
    "queue" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "exception" TEXT NOT NULL,
    "failed_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "failed_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" BIGSERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "telegram_username" VARCHAR(510) NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "histories" (
    "id" BIGSERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bio" TEXT,
    "epoch_id" INTEGER NOT NULL,
    "circle_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" BIGSERIAL NOT NULL,
    "queue" VARCHAR(510) NOT NULL,
    "payload" TEXT NOT NULL,
    "attempts" BOOLEAN NOT NULL,
    "reserved_at" INTEGER,
    "available_at" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migrations" (
    "id" SERIAL NOT NULL,
    "migration" VARCHAR(510) NOT NULL,
    "batch" INTEGER NOT NULL,

    CONSTRAINT "migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nominees" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(510) NOT NULL,
    "address" VARCHAR(510) NOT NULL,
    "nominated_by_user_id" INTEGER NOT NULL,
    "circle_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "nominated_date" DATE NOT NULL,
    "expiry_date" DATE NOT NULL,
    "vouches_required" INTEGER NOT NULL,
    "user_id" INTEGER,
    "ended" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nominees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pending_token_gifts" (
    "id" BIGSERIAL NOT NULL,
    "sender_id" BIGINT NOT NULL,
    "sender_address" VARCHAR(510) NOT NULL,
    "recipient_id" BIGINT NOT NULL,
    "recipient_address" VARCHAR(510) NOT NULL,
    "tokens" INTEGER NOT NULL,
    "note" TEXT,
    "dts_created" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "circle_id" BIGINT NOT NULL,
    "epoch_id" INTEGER,

    CONSTRAINT "pending_token_gifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_access_tokens" (
    "id" BIGSERIAL NOT NULL,
    "tokenable_type" VARCHAR(510) NOT NULL,
    "tokenable_id" BIGINT NOT NULL,
    "name" VARCHAR(510) NOT NULL,
    "token" VARCHAR(128) NOT NULL,
    "abilities" TEXT,
    "last_used_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "personal_access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" BIGSERIAL NOT NULL,
    "avatar" VARCHAR(510),
    "background" VARCHAR(510),
    "skills" TEXT,
    "bio" TEXT,
    "telegram_username" VARCHAR(510),
    "discord_username" VARCHAR(510),
    "twitter_username" VARCHAR(510),
    "github_username" VARCHAR(510),
    "medium_username" VARCHAR(510),
    "website" VARCHAR(510),
    "address" VARCHAR(510) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "admin_view" BOOLEAN NOT NULL DEFAULT false,
    "ann_power" BOOLEAN NOT NULL DEFAULT false,
    "chat_id" VARCHAR(510),

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protocols" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(510) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "telegram_id" VARCHAR(510),
    "is_verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "protocols_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teammates" (
    "id" BIGSERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "team_mate_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teammates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_gifts" (
    "id" BIGSERIAL NOT NULL,
    "sender_id" BIGINT NOT NULL,
    "sender_address" VARCHAR(510) NOT NULL,
    "recipient_id" BIGINT NOT NULL,
    "recipient_address" VARCHAR(510) NOT NULL,
    "tokens" INTEGER NOT NULL,
    "note" TEXT,
    "dts_created" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "circle_id" BIGINT NOT NULL,
    "epoch_id" INTEGER NOT NULL,

    CONSTRAINT "token_gifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(510) NOT NULL,
    "address" VARCHAR(510) NOT NULL,
    "give_token_received" INTEGER NOT NULL DEFAULT 0,
    "give_token_remaining" INTEGER NOT NULL DEFAULT 100,
    "role" INTEGER NOT NULL DEFAULT 0,
    "non_receiver" BOOLEAN NOT NULL DEFAULT true,
    "circle_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "bio" TEXT,
    "epoch_first_visit" BOOLEAN NOT NULL DEFAULT true,
    "non_giver" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(6),
    "starting_tokens" INTEGER NOT NULL DEFAULT 100,
    "fixed_non_receiver" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vouches" (
    "id" BIGSERIAL NOT NULL,
    "voucher_id" INTEGER NOT NULL,
    "nominee_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vouches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "circle_metadata_circle_id_idx" ON "circle_metadata"("circle_id");

-- CreateIndex
CREATE UNIQUE INDEX "failed_jobs_uuid_key" ON "failed_jobs"("uuid");

-- CreateIndex
CREATE INDEX "pending_token_gifts_circle_id_idx" ON "pending_token_gifts"("circle_id");

-- CreateIndex
CREATE INDEX "pending_token_gifts_recipient_id_idx" ON "pending_token_gifts"("recipient_id");

-- CreateIndex
CREATE INDEX "pending_token_gifts_sender_id_idx" ON "pending_token_gifts"("sender_id");

-- CreateIndex
CREATE UNIQUE INDEX "personal_access_tokens_token_key" ON "personal_access_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_address_key" ON "profiles"("address");

-- CreateIndex
CREATE INDEX "token_gifts_circle_id_idx" ON "token_gifts"("circle_id");

-- CreateIndex
CREATE INDEX "token_gifts_recipient_id_idx" ON "token_gifts"("recipient_id");

-- CreateIndex
CREATE INDEX "token_gifts_sender_id_idx" ON "token_gifts"("sender_id");

-- CreateIndex
CREATE INDEX "users_circle_id_idx" ON "users"("circle_id");

-- AddForeignKey
ALTER TABLE "circle_metadata" ADD CONSTRAINT "circle_metadata_circle_id_foreign" FOREIGN KEY ("circle_id") REFERENCES "circles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pending_token_gifts" ADD CONSTRAINT "pending_token_gifts_circle_id_foreign" FOREIGN KEY ("circle_id") REFERENCES "circles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pending_token_gifts" ADD CONSTRAINT "pending_token_gifts_recipient_id_foreign" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pending_token_gifts" ADD CONSTRAINT "pending_token_gifts_sender_id_foreign" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "token_gifts" ADD CONSTRAINT "token_gifts_circle_id_foreign" FOREIGN KEY ("circle_id") REFERENCES "circles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "token_gifts" ADD CONSTRAINT "token_gifts_recipient_id_foreign" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "token_gifts" ADD CONSTRAINT "token_gifts_sender_id_foreign" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_circle_id_foreign" FOREIGN KEY ("circle_id") REFERENCES "circles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
