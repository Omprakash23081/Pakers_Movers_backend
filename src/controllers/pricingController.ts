import { Request, Response } from 'express';
import Pricing from '../models/Pricing';

// @desc    Get all pricing data
// @route   GET /api/pricing
// @access  Public
export const getAllPricing = async (req: Request, res: Response) => {
  try {
    const pricing = await Pricing.find();
    res.json(pricing);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pricing by category
// @route   GET /api/pricing/:category
// @access  Public
export const getPricingByCategory = async (req: Request, res: Response) => {
  try {
    const category = req.params.category as string;
    const pricing = await Pricing.findOne({ category });
    if (pricing) {
      res.json(pricing);
    } else {
      res.status(404).json({ message: 'Pricing not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update pricing for a category
// @route   PUT /api/pricing/:category
// @access  Private (Admin)
export const updatePricing = async (req: Request, res: Response) => {
  try {
    const { tiers } = req.body;
    const category = req.params.category as string;
    let pricing = await Pricing.findOne({ category });

    if (pricing) {
      pricing.tiers = tiers;
      await pricing.save();
      res.json(pricing);
    } else {
      pricing = await Pricing.create({
        category,
        tiers
      });
      res.status(201).json(pricing);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed initial pricing data
// @route   POST /api/pricing/seed
// @access  Private (Admin)
export const seedPricing = async (req: Request, res: Response) => {
  const initialData = [
    {
      category: 'house',
      tiers: [
        { 
          type: '1 BHK Home', 
          costs: { 
            upTo50km: '₹7,000 - ₹11,000', 
            upTo500km: '₹12,000 - ₹16,000', 
            upTo1000km: '₹20,000 - ₹25,000', 
            upTo1500km: '₹26,000 - ₹32,000', 
            upTo2500km: '₹30,000 - ₹35,000' 
          } 
        },
        { 
          type: '2 BHK Home', 
          costs: { 
            upTo50km: '₹12,000 - ₹15,000', 
            upTo500km: '₹20,000 - ₹23,000', 
            upTo1000km: '₹25,000 - ₹30,000', 
            upTo1500km: '₹32,000 - ₹40,000', 
            upTo2500km: '₹40,000 - ₹45,000' 
          } 
        },
        { 
          type: '3 BHK Home', 
          costs: { 
            upTo50km: '₹15,000 - ₹18,000', 
            upTo500km: '₹25,000 - ₹30,000', 
            upTo1000km: '₹35,000 - ₹40,000', 
            upTo1500km: '₹45,000 - ₹50,000', 
            upTo2500km: '₹50,000 - ₹65,000' 
          } 
        },
        { 
          type: '4 BHK / Villa', 
          costs: { 
            upTo50km: '₹25,000 - ₹30,000', 
            upTo500km: '₹35,000 - ₹40,000', 
            upTo1000km: '₹50,000 - ₹60,000', 
            upTo1500km: '₹55,000 - ₹65,000', 
            upTo2500km: '₹70,000 - ₹90,000' 
          } 
        }
      ]
    },
    {
      category: 'office',
      tiers: [
        { 
          type: 'Small (1-10 ppl)', 
          costs: { 
            upTo50km: '₹8,000 - ₹15,000', 
            upTo500km: '₹15,000 - ₹25,000', 
            upTo1000km: '₹25,000 - ₹45,000', 
            upTo1500km: '₹45,000+', 
            upTo2500km: 'Contact Us' 
          } 
        },
        { 
          type: 'Medium (10-30 ppl)', 
          costs: { 
            upTo50km: '₹15,000 - ₹35,000', 
            upTo500km: '₹35,000 - ₹60,000', 
            upTo1000km: '₹60,000+', 
            upTo1500km: '₹90,000+', 
            upTo2500km: 'Contact Us' 
          } 
        },
        { 
          type: 'Large (30-50 ppl)', 
          costs: { 
            upTo50km: '₹40,000+', 
            upTo500km: '₹75,000+', 
            upTo1000km: '₹1.2L+', 
            upTo1500km: '₹2.5L+', 
            upTo2500km: 'Contact Us' 
          } 
        }
      ]
    },
    {
      category: 'vehicle',
      tiers: [
        { 
          type: 'Two Wheeler', 
          costs: { 
            upTo50km: '₹2,000 - ₹3,500', 
            upTo500km: '₹4,000 - ₹6,000', 
            upTo1000km: '₹6,000 - ₹8,500', 
            upTo1500km: '₹9,000+', 
            upTo2500km: '₹10,000+' 
          } 
        },
        { 
          type: 'Hatchback Car', 
          costs: { 
            upTo50km: '₹5,000 - ₹8,000', 
            upTo500km: '₹10,000 - ₹15,000', 
            upTo1000km: '₹15,000 - ₹22,000', 
            upTo1500km: '₹25,000+', 
            upTo2500km: '₹28,000+' 
          } 
        },
        { 
          type: 'Sedan / SUV', 
          costs: { 
            upTo50km: '₹7,000 - ₹12,000', 
            upTo500km: '₹15,000 - ₹22,000', 
            upTo1000km: '₹22,000 - ₹32,000', 
            upTo1500km: '₹35,000+', 
            upTo2500km: '₹38,000+' 
          } 
        }
      ]
    }
  ];

  try {
    await Pricing.deleteMany({});
    await Pricing.insertMany(initialData);
    res.json({ message: 'Pricing data seeded successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
