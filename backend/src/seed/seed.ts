import mongoose from 'mongoose';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { Skill } from '../models/Skill';
import { Project } from '../models/Project';
import { Certificate } from '../models/Certificate';
import { Achievement } from '../models/Achievement';
import { SiteSettings } from '../models/SiteSettings';

const seedDB = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.trim();
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword || adminPassword.length < 12) {
      throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) before seeding.');
    }
    await mongoose.connect(config.MONGODB_URI);
    logger.info('✅ Connected to MongoDB for seeding');

    const existingCounts = await Promise.all([
      User.countDocuments(), Profile.countDocuments(), Skill.countDocuments(), Project.countDocuments(),
      Certificate.countDocuments(), Achievement.countDocuments(), SiteSettings.countDocuments(),
    ]);
    if (existingCounts.some((count) => count > 0) && process.env.ALLOW_DESTRUCTIVE_SEED !== 'true') {
      throw new Error('Database already contains portfolio data. Set ALLOW_DESTRUCTIVE_SEED=true only if you intend to clear and reseed it.');
    }

    logger.info('Clearing collections...');
    await Promise.all([
      User.deleteMany({}),
      Profile.deleteMany({}),
      Skill.deleteMany({}),
      Project.deleteMany({}),
      Certificate.deleteMany({}),
      Achievement.deleteMany({}),
      SiteSettings.deleteMany({}),
    ]);

    logger.info('Creating admin user...');
    await User.create({
      email: adminEmail,
      passwordHash: adminPassword,
      role: 'admin',
    });

    logger.info('Creating profile...');
    await Profile.create({
      name: '[YOUR NAME]',
      username: 'johndoe',
      title: '[YOUR TITLE]',
      tagline: '[DEMO] Crafting digital experiences with passion.',
      email: adminEmail,
    });

    logger.info('Creating site settings...');
    await SiteSettings.create({
      siteName: 'My Portfolio',
      siteTitle: 'My Portfolio - Developer',
      primaryEmail: adminEmail,
    });

    logger.info('Creating demo skills...');
    const skills = [];
    for (let i = 1; i <= 5; i++) {
      skills.push({ name: `[DEMO] Programming Skill ${i}`, category: 'programming', proficiency: 4, published: true });
      skills.push({ name: `[DEMO] Frontend Skill ${i}`, category: 'frontend', proficiency: 5, published: true });
      skills.push({ name: `[DEMO] Backend Skill ${i}`, category: 'backend', proficiency: 4, published: true });
    }
    await Skill.insertMany(skills);

    logger.info('Creating demo projects...');
    const projects = [];
    for (let i = 1; i <= 3; i++) {
      projects.push({
        title: `[DEMO] Sample Project ${i}`,
        slug: `demo-sample-project-${i}`,
        shortDescription: 'A demo project for the portfolio.',
        description: 'Detailed description of the demo project goes here.',
        category: 'web',
        status: 'completed',
        published: false,
      });
    }
    await Project.insertMany(projects);

    logger.info('Creating demo certificates...');
    const certificates = [];
    for (let i = 1; i <= 3; i++) {
      certificates.push({
        title: `[DEMO] Sample Certificate ${i}`,
        issuer: 'Demo Issuer',
        issueDate: new Date(),
        published: false,
      });
    }
    await Certificate.insertMany(certificates);

    logger.info('Creating demo achievements...');
    const achievements = [];
    for (let i = 1; i <= 3; i++) {
      achievements.push({
        title: `[DEMO] Sample Achievement ${i}`,
        organization: 'Demo Org',
        date: new Date(),
        category: 'other',
        published: false,
      });
    }
    await Achievement.insertMany(achievements);

    logger.info('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
