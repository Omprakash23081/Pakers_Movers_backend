"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPricing = exports.updatePricing = exports.getPricingByCategory = exports.getAllPricing = void 0;
const Pricing_1 = __importDefault(require("../models/Pricing"));
// @desc    Get all pricing data
// @route   GET /api/pricing
// @access  Public
const getAllPricing = async (req, res) => {
    try {
        const pricing = await Pricing_1.default.find();
        res.json(pricing);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllPricing = getAllPricing;
// @desc    Get pricing by category
// @route   GET /api/pricing/:category
// @access  Public
const getPricingByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const pricing = await Pricing_1.default.findOne({ category });
        if (pricing) {
            res.json(pricing);
        }
        else {
            res.status(404).json({ message: 'Pricing not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getPricingByCategory = getPricingByCategory;
// @desc    Update pricing for a category
// @route   PUT /api/pricing/:category
// @access  Private (Admin)
const updatePricing = async (req, res) => {
    try {
        const { tiers } = req.body;
        const category = req.params.category;
        let pricing = await Pricing_1.default.findOne({ category });
        if (pricing) {
            pricing.tiers = tiers;
            await pricing.save();
            res.json(pricing);
        }
        else {
            pricing = await Pricing_1.default.create({
                category,
                tiers
            });
            res.status(201).json(pricing);
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updatePricing = updatePricing;
// @desc    Seed initial pricing data
// @route   POST /api/pricing/seed
// @access  Private (Admin)
const seedPricing = async (req, res) => {
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
        await Pricing_1.default.deleteMany({});
        await Pricing_1.default.insertMany(initialData);
        res.json({ message: 'Pricing data seeded successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.seedPricing = seedPricing;
