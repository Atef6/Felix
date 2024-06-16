const asyncHandler = require("express-async-handler");
const { Anime } = require('../modules/Anime')
const Video = require('../modules/Video')

module.exports.animeDays = asyncHandler(async (req, res) => {
    const daysOfWeek = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const result = {};

    for (const day of daysOfWeek) {
        const animes = await Anime.find({ Status: 'يعرض الان', day });
        result[day] = animes;
    }

    res.status(200).json(result);
})

module.exports.TopAnime = asyncHandler(async (req, res) => {
    const topAnime = await Anime.find().sort({ rating: -1 }).limit(20)
    res.status(200).json(topAnime)
})

module.exports.randomAnime = asyncHandler(async (req, res) => {
    const numberOfItems = 20;
    const randomAnime = await Anime.aggregate([
        { $sample: { size: numberOfItems } }
    ]);
    res.status(200).json(randomAnime);
});

module.exports.addAllAnimes = asyncHandler(async (req, res) => {
    const newAnime = await Anime.create(req.body)
    res.status(201).json(newAnime)
})

 module.exports.getAllAnimes = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    let sort = req.query.sort || "rating";
    let genre = req.query.genre || "All";
    let type = req.query.type || null;
    const genreOptions = [
        "أكشن",
        "رومانسي",
        "خيال",
        "دراما",
        "جريمة",
        "مغامرات",
        "إثارة",
        "خيال علمي",
        "موسيقى",
        "عائلي",
        "شونين",
        "خارق للطبيعة",
        "غيبلي",
        "غموض",
        "مدرسي",
        "سينين",
        "كوميدي",
    ];

    genre === "All"
        ? (genre = [...genreOptions])
        : (genre = req.query.genre.split(","));

    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
    let sortBy = {};

    // Check if sorting by "recent"
    if (sort[0] === "recent") {
        sortBy = { createdAt: "desc" }; // Sort by the creation date in descending order
    } else if (sort[1]) {
        sortBy[sort[0]] = sort[1];
    } else {
        sortBy[sort[0]] = "asc";
    }

    const query = {
        name: { $regex: search, $options: "i" },
        genre: { $in: [...genre] },
    };

    if (type) {
        query.type = type;
    }

    try {
        const animes = await Anime.find(query)
            .sort(sortBy)
            .skip(page * limit)
            .limit(limit);

        const total = await Anime.countDocuments(query);

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            genres: genreOptions,
            animes,
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

module.exports.getAnimeById = asyncHandler(async (req, res) => {
    const anime = await Anime.findById(req.params.id)
    if (anime) {
        res.status(200).json(anime)
    } else {
        res.status(404).json({ status: "Falid", });
    }
})

module.exports.updateAnime = asyncHandler(async (req, res) => {
    const UpdateAnime = await Anime.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            desc: req.body.desc,
            img: req.body.img,
            trailer: req.body.trailer,
            year: req.body.year,
            genre: req.body.genre,
            Status: req.body.Status,
            day: req.body.day,
        }
    }, { new: true })
    res.status(200).json({ UpdateAnime })
})

module.exports.deleteAnime = asyncHandler(async (req, res) => {
    const deleteAnime = await Anime.findById(req.params.id);
    if (!deleteAnime) {
        res.status(404).json({ message: "Anime not found" });
        return;
    }

    // Delete associated videos
    await Video.deleteMany({ _id: { $in: deleteAnime.epsideo } });

    // Delete the anime
    await Anime.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: `Deleted Anime with ID ${req.params.id}` });
})