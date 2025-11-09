-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `user_type` ENUM('SENIMAN', 'KLIEN', 'ADMIN') NOT NULL,
    `first_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `profile_picture_url` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `email_verified_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seniman_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `bio` VARCHAR(191) NULL,
    `lokasi` VARCHAR(191) NULL,
    `kategori` VARCHAR(191) NULL,
    `rate_per_hour` DECIMAL(65, 30) NULL,
    `rate_per_project` DECIMAL(65, 30) NULL,
    `rating_average` DECIMAL(65, 30) NULL DEFAULT 0,
    `total_reviews` INTEGER NOT NULL DEFAULT 0,
    `total_projects_completed` INTEGER NOT NULL DEFAULT 0,
    `response_time_hours` INTEGER NULL,
    `portfolio_count` INTEGER NOT NULL DEFAULT 0,
    `years_experience` INTEGER NULL,
    `availability_status` ENUM('AVAILABLE', 'BUSY', 'ON_BREAK') NOT NULL DEFAULT 'AVAILABLE',
    `verification_status` ENUM('UNVERIFIED', 'PENDING', 'VERIFIED') NOT NULL DEFAULT 'UNVERIFIED',
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `seniman_profiles_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `klien_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `company_name` VARCHAR(191) NULL,
    `company_description` VARCHAR(191) NULL,
    `company_website` VARCHAR(191) NULL,
    `company_size` ENUM('PERSONAL', 'STARTUP', 'SMALL', 'MEDIUM', 'LARGE') NULL DEFAULT 'PERSONAL',
    `industry` VARCHAR(191) NULL,
    `total_projects_posted` INTEGER NOT NULL DEFAULT 0,
    `total_spent` DECIMAL(65, 30) NULL DEFAULT 0,
    `rating_as_buyer` DECIMAL(65, 30) NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `klien_profiles_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `portfolio_items` (
    `id` VARCHAR(191) NOT NULL,
    `seniman_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `image_urls` VARCHAR(191) NULL,
    `video_url` VARCHAR(191) NULL,
    `project_date` DATETIME(3) NULL,
    `client_name` VARCHAR(191) NULL,
    `tools_used` VARCHAR(191) NULL,
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` VARCHAR(191) NOT NULL,
    `klien_id` VARCHAR(191) NOT NULL,
    `seniman_id` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `budget` DECIMAL(65, 30) NOT NULL,
    `budget_type` ENUM('FIXED', 'HOURLY') NOT NULL,
    `status` ENUM('DRAFT', 'POSTED', 'NEGOTIATING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `start_date` DATETIME(3) NULL,
    `deadline` DATETIME(3) NULL,
    `estimated_duration_days` INTEGER NULL,
    `required_skills` VARCHAR(191) NULL,
    `attachments` VARCHAR(191) NULL,
    `klien_notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `completed_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_proposals` (
    `id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `seniman_id` VARCHAR(191) NOT NULL,
    `proposed_budget` DECIMAL(65, 30) NOT NULL,
    `proposed_timeline_days` INTEGER NULL,
    `cover_letter` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `project_proposals_project_id_seniman_id_key`(`project_id`, `seniman_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `klien_id` VARCHAR(191) NOT NULL,
    `seniman_id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'IDR',
    `payment_method` ENUM('CARD', 'BANK_TRANSFER', 'E_WALLET') NOT NULL,
    `payment_gateway` ENUM('STRIPE', 'MIDTRANS') NOT NULL,
    `gateway_transaction_id` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `escrow_status` ENUM('HELD', 'RELEASED', 'REFUNDED') NOT NULL DEFAULT 'HELD',
    `fee_percentage` DECIMAL(65, 30) NOT NULL DEFAULT 10,
    `platform_fee` DECIMAL(65, 30) NOT NULL,
    `net_amount` DECIMAL(65, 30) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `completed_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `reviewer_id` VARCHAR(191) NOT NULL,
    `reviewee_id` VARCHAR(191) NOT NULL,
    `reviewer_type` ENUM('KLIEN', 'SENIMAN') NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` VARCHAR(191) NULL,
    `professionalism` INTEGER NULL,
    `quality_of_work` INTEGER NULL,
    `communication` INTEGER NULL,
    `timeliness` INTEGER NULL,
    `would_hire_again` BOOLEAN NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `reviews_project_id_reviewer_id_key`(`project_id`, `reviewer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NULL,
    `sender_id` VARCHAR(191) NOT NULL,
    `receiver_id` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `attachment_urls` VARCHAR(191) NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `read_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `type` ENUM('PROJECT_INVITE', 'PROPOSAL_ACCEPTED', 'PAYMENT_RECEIVED', 'REVIEW_POSTED', 'MESSAGE_RECEIVED', 'PROJECT_UPDATE') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `related_id` VARCHAR(191) NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_logs` (
    `id` VARCHAR(191) NOT NULL,
    `admin_id` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `entity_type` VARCHAR(191) NOT NULL,
    `entity_id` VARCHAR(191) NOT NULL,
    `old_values` VARCHAR(191) NULL,
    `new_values` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `seniman_profiles` ADD CONSTRAINT `seniman_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `klien_profiles` ADD CONSTRAINT `klien_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `portfolio_items` ADD CONSTRAINT `portfolio_items_seniman_id_fkey` FOREIGN KEY (`seniman_id`) REFERENCES `seniman_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_klien_id_fkey` FOREIGN KEY (`klien_id`) REFERENCES `klien_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_seniman_id_fkey` FOREIGN KEY (`seniman_id`) REFERENCES `seniman_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_proposals` ADD CONSTRAINT `project_proposals_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_proposals` ADD CONSTRAINT `project_proposals_seniman_id_fkey` FOREIGN KEY (`seniman_id`) REFERENCES `seniman_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_klien_id_fkey` FOREIGN KEY (`klien_id`) REFERENCES `klien_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_seniman_id_fkey` FOREIGN KEY (`seniman_id`) REFERENCES `seniman_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_reviewer_user_fkey` FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_reviewer_klien_fkey` FOREIGN KEY (`reviewer_id`) REFERENCES `klien_profiles`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_reviewee_user_fkey` FOREIGN KEY (`reviewee_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_reviewee_seniman_fkey` FOREIGN KEY (`reviewee_id`) REFERENCES `seniman_profiles`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_sender_seniman_fkey` FOREIGN KEY (`sender_id`) REFERENCES `seniman_profiles`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_sender_klien_fkey` FOREIGN KEY (`sender_id`) REFERENCES `klien_profiles`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_receiver_seniman_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `seniman_profiles`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_receiver_klien_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `klien_profiles`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_logs` ADD CONSTRAINT `admin_logs_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
