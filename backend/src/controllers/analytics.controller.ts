import { Request, Response } from 'express';
import { VisitorSession } from '../models/VisitorSession';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { identifyDevice, sanitizeReferrer } from '../utils/deviceIdentification';

const retentionMs = 180 * 24 * 60 * 60 * 1000;

export const recordVisitorPageView = asyncHandler(async (req: Request, res: Response) => {
  const { visitorId, sessionId, path, referrer, language, clientHints, ...dimensions } = req.body;
  const now = new Date();
  const device = identifyDevice(req.get('user-agent') || '', clientHints);
  const safePath = path.split(/[?#]/, 1)[0].slice(0, 512) || '/';
  const countryHeader = req.get('cf-ipcountry') || req.get('x-vercel-ip-country') || '';
  const approximateLocation = /^[A-Za-z]{2}$/.test(countryHeader) ? countryHeader.toUpperCase() : 'Unavailable';

  await VisitorSession.findOneAndUpdate(
    { sessionId },
    {
      $setOnInsert: {
        visitorId,
        ...device,
        approximateLocation,
        language: language.trim(),
        firstVisitedAt: now,
      },
      $set: {
        ...dimensions,
        lastVisitedAt: now,
        expiresAt: new Date(now.getTime() + retentionMs),
      },
      $push: { pageViews: { $each: [{ path: safePath, referrer: sanitizeReferrer(referrer), visitedAt: now }], $slice: -100 } },
      $inc: { pageViewCount: 1 },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true },
  );

  sendSuccess(res, { recorded: true }, 'Anonymous page view recorded', 201);
});

export const getVisitorSessions = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string | undefined>;
  const filter: Record<string, string> = {};
  if (query.brand) filter.brand = query.brand;
  if (query.category) filter.category = query.category;
  if (query.os) filter.os = query.os;
  if (query.browser) filter.browser = query.browser;

  const { page, limit, skip } = getPaginationParams(query);
  const [items, total, brands, operatingSystems, browsers] = await Promise.all([
    VisitorSession.find(filter).sort({ lastVisitedAt: -1 }).skip(skip).limit(limit).lean(),
    VisitorSession.countDocuments(filter),
    VisitorSession.distinct('brand'),
    VisitorSession.distinct('os'),
    VisitorSession.distinct('browser'),
  ]);

  sendSuccess(res, {
    items,
    filters: { brands: brands.sort(), operatingSystems: operatingSystems.sort(), browsers: browsers.sort() },
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  });
});
