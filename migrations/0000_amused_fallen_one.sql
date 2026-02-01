CREATE TABLE "active_effects" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_id" varchar NOT NULL,
	"applied_by" varchar,
	"type" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"value" varchar,
	"is_active" boolean DEFAULT true,
	"duration" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chapter_events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chapter_id" varchar NOT NULL,
	"session_id" varchar,
	"event_type" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"metadata" jsonb DEFAULT '{}',
	"character_id" varchar,
	"user_id" varchar,
	"is_important" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chapters" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" varchar,
	"name" varchar NOT NULL,
	"description" text,
	"order_index" integer DEFAULT 0 NOT NULL,
	"status" varchar DEFAULT 'planned',
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "characters" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"session_id" varchar,
	"name" varchar NOT NULL,
	"occupation" varchar NOT NULL,
	"age" integer,
	"birthplace" varchar,
	"residence" varchar,
	"gender" varchar,
	"height" varchar,
	"build" varchar,
	"hair_color" varchar,
	"eye_color" varchar,
	"strength" integer NOT NULL,
	"constitution" integer NOT NULL,
	"size" integer NOT NULL,
	"dexterity" integer NOT NULL,
	"appearance" integer NOT NULL,
	"intelligence" integer NOT NULL,
	"power" integer NOT NULL,
	"education" integer NOT NULL,
	"luck" integer NOT NULL,
	"hit_points" integer NOT NULL,
	"max_hit_points" integer NOT NULL,
	"sanity" integer NOT NULL,
	"max_sanity" integer NOT NULL,
	"magic_points" integer NOT NULL,
	"max_magic_points" integer NOT NULL,
	"avatar_url" varchar,
	"avatar_prompt" text,
	"skills" jsonb DEFAULT '{}' NOT NULL,
	"skills_locked" boolean DEFAULT false,
	"available_skill_points" integer DEFAULT 0,
	"notes" text,
	"money" numeric(10, 2) DEFAULT '0.00',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "game_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"code" varchar(6),
	"gm_id" varchar NOT NULL,
	"status" varchar DEFAULT 'preparation',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "game_sessions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"category" varchar NOT NULL,
	"quantity" integer DEFAULT 1,
	"weight" integer DEFAULT 1,
	"is_equipped" boolean DEFAULT false,
	"damage" varchar,
	"armor" integer,
	"properties" jsonb DEFAULT '{}',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "narrative_entries" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" varchar,
	"gm_id" varchar NOT NULL,
	"content" text NOT NULL,
	"entry_type" varchar DEFAULT 'note',
	"is_ai_generated" boolean DEFAULT false,
	"metadata" jsonb DEFAULT '{}',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "roll_history" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"character_id" varchar,
	"session_id" varchar,
	"roll_type" varchar NOT NULL,
	"skill_name" varchar,
	"skill_value" integer,
	"dice_formula" varchar NOT NULL,
	"result" integer NOT NULL,
	"outcome" varchar,
	"is_gm_roll" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sanity_conditions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_id" varchar NOT NULL,
	"type" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"duration" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_config" (
	"key" varchar PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"description" text,
	"updated_by" varchar,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"password_hash" varchar,
	"auth_type" varchar DEFAULT 'local',
	"is_gm" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "active_effects" ADD CONSTRAINT "active_effects_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "active_effects" ADD CONSTRAINT "active_effects_applied_by_users_id_fk" FOREIGN KEY ("applied_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter_events" ADD CONSTRAINT "chapter_events_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter_events" ADD CONSTRAINT "chapter_events_session_id_game_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."game_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter_events" ADD CONSTRAINT "chapter_events_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter_events" ADD CONSTRAINT "chapter_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_session_id_game_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."game_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_session_id_game_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."game_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_gm_id_users_id_fk" FOREIGN KEY ("gm_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_entries" ADD CONSTRAINT "narrative_entries_session_id_game_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."game_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "narrative_entries" ADD CONSTRAINT "narrative_entries_gm_id_users_id_fk" FOREIGN KEY ("gm_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roll_history" ADD CONSTRAINT "roll_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roll_history" ADD CONSTRAINT "roll_history_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roll_history" ADD CONSTRAINT "roll_history_session_id_game_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."game_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sanity_conditions" ADD CONSTRAINT "sanity_conditions_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_config" ADD CONSTRAINT "system_config_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");--> statement-breakpoint
CREATE INDEX "IDX_system_config_updated_at" ON "system_config" USING btree ("updated_at");