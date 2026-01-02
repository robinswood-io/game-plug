import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { DatabaseService } from '../../../common/database/database.service';

@Injectable()
export class AvatarStorageService {
  private readonly avatarsDir: string;

  constructor(private db: DatabaseService) {
    this.avatarsDir = path.join(process.cwd(), 'public', 'avatars');

    if (!fs.existsSync(this.avatarsDir)) {
      fs.mkdirSync(this.avatarsDir, { recursive: true });
    }
  }

  async downloadAndSaveImage(imageUrl: string, characterId: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const imageBuffer = Buffer.from(buffer);

      const timestamp = Date.now();
      const hash = crypto.createHash('md5').update(`${characterId}-${timestamp}`).digest('hex').substring(0, 8);
      const filename = `avatar-${characterId}-${hash}.png`;
      const filepath = path.join(this.avatarsDir, filename);

      fs.writeFileSync(filepath, imageBuffer);

      return `/avatars/${filename}`;
    } catch (error) {
      console.error('Error downloading and saving image:', error);
      throw new Error('Failed to save avatar image');
    }
  }

  async deleteAvatar(avatarUrl: string): Promise<void> {
    try {
      if (!avatarUrl || !avatarUrl.startsWith('/avatars/')) {
        return;
      }

      const filename = avatarUrl.replace('/avatars/', '');
      const filepath = path.join(this.avatarsDir, filename);

      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch (error) {
      console.error('Error deleting avatar:', error);
    }
  }

  avatarFileExists(avatarUrl: string): boolean {
    try {
      if (!avatarUrl || !avatarUrl.startsWith('/avatars/')) {
        return false;
      }

      const filename = avatarUrl.replace('/avatars/', '');
      const filepath = path.join(this.avatarsDir, filename);

      return fs.existsSync(filepath);
    } catch (error) {
      console.error('Error checking avatar existence:', error);
      return false;
    }
  }

  copyAvatar(sourceAvatarUrl: string, targetCharacterId: string): string | null {
    try {
      if (!sourceAvatarUrl || !sourceAvatarUrl.startsWith('/avatars/')) {
        return null;
      }

      const sourceFilename = sourceAvatarUrl.replace('/avatars/', '');
      const sourceFilepath = path.join(this.avatarsDir, sourceFilename);

      if (!fs.existsSync(sourceFilepath)) {
        console.error(`Source avatar not found: ${sourceFilepath}`);
        return null;
      }

      const timestamp = Date.now();
      const hash = crypto.createHash('md5').update(`${targetCharacterId}-${timestamp}`).digest('hex').substring(0, 8);
      const targetFilename = `avatar-${targetCharacterId}-${hash}.png`;
      const targetFilepath = path.join(this.avatarsDir, targetFilename);

      fs.copyFileSync(sourceFilepath, targetFilepath);

      return `/avatars/${targetFilename}`;
    } catch (error) {
      console.error('Error copying avatar:', error);
      return null;
    }
  }

  async migrateExistingAvatars(): Promise<{ success: number; failed: number; total: number }> {
    try {
      console.log('Starting avatar migration...');

      const allCharacters = await this.db.getAllCharacters();
      const charactersToMigrate = allCharacters.filter(
        (character) =>
          character.avatarUrl &&
          !character.avatarUrl.startsWith('/avatars/') &&
          (character.avatarUrl.includes('oaidalleapiprodscus') ||
            character.avatarUrl.includes('openai') ||
            character.avatarUrl.includes('dalle')),
      );

      console.log(`Found ${charactersToMigrate.length} characters with external avatar URLs to migrate`);

      let successCount = 0;
      let failCount = 0;

      for (const character of charactersToMigrate) {
        try {
          console.log(`Migrating avatar for ${character.name} (${character.id})`);

          if (!character.avatarUrl) {
            console.log(`Skipping ${character.name} - no avatar URL`);
            continue;
          }

          const localUrl = await this.downloadAndSaveImage(character.avatarUrl, character.id);

          await this.db.updateCharacter(character.id, {
            avatarUrl: localUrl,
          });

          successCount++;
          console.log(`Successfully migrated avatar for ${character.name}`);
        } catch (error) {
          failCount++;
          console.error(`Failed to migrate avatar for ${character.name}:`, error);
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      console.log(`Migration complete: ${successCount} successful, ${failCount} failed`);
      return { success: successCount, failed: failCount, total: charactersToMigrate.length };
    } catch (error) {
      console.error('Error during migration:', error);
      throw error;
    }
  }
}
