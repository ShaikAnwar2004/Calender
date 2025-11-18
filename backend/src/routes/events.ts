import express from 'express';
import Event from '../models/Event.js';


const router = express.Router();


// GET /api/events?start=ISO&end=ISO
router.get('/', async (req, res) => {
try {
const { start, end } = req.query;
if (!start || !end) return res.status(400).json({ message: 'start and end required' });
const s = new Date(String(start));
const e = new Date(String(end));


// fetch events that intersect the requested range
const events = await Event.find({
$and: [
{ start: { $lt: e } },
{ end: { $gt: s } }
]
}).lean();


res.json(events);
} catch (err) {
res.status(500).json({ message: 'Server error', error: err });
}
});


router.post('/', async (req, res) => {
try {
const ev = await Event.create(req.body);
res.status(201).json(ev);
} catch (err) {
res.status(400).json({ message: 'Bad request', error: err });
}
});


router.put('/:id', async (req, res) => {
try {
const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(ev);
} catch (err) {
res.status(400).json({ message: 'Bad request', error: err });
}
});


router.delete('/:id', async (req, res) => {
try {
await Event.findByIdAndDelete(req.params.id);
res.status(204).end();
} catch (err) {
res.status(400).json({ message: 'Bad request', error: err });
}
});


export default router;