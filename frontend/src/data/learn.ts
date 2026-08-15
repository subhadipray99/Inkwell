// Original, public-domain-safe study content written for this app.
// No copyrighted third-party text — concise explainers and book overviews.

export type ArticleSection = { heading?: string; text: string };
export type Article = {
  id: string;
  title: string;
  subtitle: string;
  minutes: number;
  icon: string; // Feather icon name
  sections: ArticleSection[];
};

export const ARTICLES: Article[] = [
  {
    id: 'what-is-the-bible',
    title: 'What Is the Bible?',
    subtitle: 'A quick orientation to the world’s most-read book',
    minutes: 3,
    icon: 'book',
    sections: [
      {
        text: 'The Bible is not one book but a library — 66 books written by dozens of authors across roughly 1,500 years, on three continents, in three languages (Hebrew, Aramaic, and Greek). It ranges from law and history to poetry, prophecy, letters, and biography.',
      },
      {
        heading: 'One story, many voices',
        text: 'Despite its variety, Christians have long read the Bible as a single unfolding story: creation, humanity’s brokenness, and a long rescue that centers on Jesus. Understanding a passage often means asking where it sits in that larger arc.',
      },
      {
        heading: 'Chapters and verses',
        text: 'The chapter and verse numbers you see were added centuries later to help readers find their place. They’re useful signposts, not part of the original writing, so it’s worth reading past a verse break to catch the full thought.',
      },
    ],
  },
  {
    id: 'two-testaments',
    title: 'The Two Testaments',
    subtitle: 'How the Old and New Testaments fit together',
    minutes: 3,
    icon: 'layers',
    sections: [
      {
        text: '“Testament” means covenant, or binding agreement. The Old Testament (39 books) tells the story of God and the people of Israel; the New Testament (27 books) tells of Jesus and the early church.',
      },
      {
        heading: 'Old Testament',
        text: 'It opens with the Law (Genesis–Deuteronomy), continues through history (Joshua–Esther), pauses for poetry and wisdom (Job–Song of Solomon), and closes with the prophets (Isaiah–Malachi).',
      },
      {
        heading: 'New Testament',
        text: 'It begins with four Gospels about Jesus, follows the church’s spread in Acts, gathers letters to young congregations, and ends with the visionary book of Revelation.',
      },
    ],
  },
  {
    id: 'how-to-start',
    title: 'How to Start Reading',
    subtitle: 'A gentle on-ramp if you’re new',
    minutes: 2,
    icon: 'compass',
    sections: [
      {
        text: 'You don’t have to read front to back. Many people start with the Gospel of John or Mark to meet Jesus first, then read Genesis for the story’s beginning, and Psalms for prayer and poetry.',
      },
      {
        heading: 'Read in context',
        text: 'Aim for a chapter at a time rather than isolated verses. Ask three simple questions: What’s happening? What does it say about God and people? Is there something to carry into today?',
      },
      {
        heading: 'Keep a rhythm',
        text: 'A few minutes each day builds further than an occasional marathon. Use the streak and bookmarks in this app to keep your place and mark what stands out.',
      },
    ],
  },
  {
    id: 'literary-styles',
    title: 'Literary Styles in Scripture',
    subtitle: 'Reading poetry differently than law',
    minutes: 3,
    icon: 'feather',
    sections: [
      {
        text: 'The Bible speaks in many genres, and each asks to be read in its own way. Reading poetry as if it were a legal code — or a parable as if it were history — leads to confusion.',
      },
      {
        heading: 'Common genres',
        text: 'Narrative tells what happened; law gives instructions; poetry and wisdom use vivid images and parallel lines; prophecy warns and promises; Gospels present Jesus; and letters address specific communities and questions.',
      },
      {
        heading: 'A practical tip',
        text: 'When a line feels strange, ask what kind of writing it is. Hebrew poetry, for example, often repeats an idea in two lines — the second echoing or sharpening the first.',
      },
    ],
  },
  {
    id: 'timeline',
    title: 'A Bird’s-Eye Timeline',
    subtitle: 'The big moments, in order',
    minutes: 3,
    icon: 'clock',
    sections: [
      {
        text: 'Holding a rough timeline in mind makes the story easier to follow. These are broad, widely used markers rather than precise dates.',
      },
      {
        heading: 'Old Testament arc',
        text: 'Beginnings (Genesis 1–11) → the family of Abraham → slavery and exodus from Egypt → the giving of the Law → settling the land → kings like David and Solomon → a divided kingdom → exile in Babylon → return and rebuilding.',
      },
      {
        heading: 'New Testament arc',
        text: 'The birth, ministry, death, and resurrection of Jesus → the founding of the church at Pentecost → Paul’s missionary journeys and letters → and a closing vision of renewal in Revelation.',
      },
    ],
  },
];

export type BookIntro = {
  theme: string;
  author: string;
  date: string;
  summary: string;
};

export const BOOK_INTROS: Record<string, BookIntro> = {
  Genesis: { theme: 'Beginnings', author: 'Traditionally Moses', date: 'c. 1400 BC (setting: earliest times)', summary: 'The book of origins — creation, the first families, the flood, and the calling of Abraham’s family through whom the whole world would be blessed.' },
  Exodus: { theme: 'Rescue & covenant', author: 'Traditionally Moses', date: 'c. 1400 BC', summary: 'God delivers Israel from slavery in Egypt, gives the Ten Commandments at Sinai, and comes to dwell among his people in the tabernacle.' },
  Leviticus: { theme: 'Holiness', author: 'Traditionally Moses', date: 'c. 1400 BC', summary: 'Instructions for worship, sacrifice, and holy living, showing how a flawed people could live near a holy God.' },
  Numbers: { theme: 'Wilderness journey', author: 'Traditionally Moses', date: 'c. 1400 BC', summary: 'Israel’s long, often faltering journey through the desert toward the promised land, marked by testing and God’s patience.' },
  Deuteronomy: { theme: 'Renewed covenant', author: 'Traditionally Moses', date: 'c. 1400 BC', summary: 'Moses’ farewell speeches, retelling the law and calling a new generation to love and obey God as they enter the land.' },
  Joshua: { theme: 'Entering the land', author: 'Joshua / later editors', date: 'c. 1375 BC', summary: 'Under Joshua, Israel enters and settles the promised land, learning that success depends on faithfulness to God.' },
  Judges: { theme: 'Cycles of decline', author: 'Traditionally Samuel', date: 'c. 1050 BC', summary: 'A turbulent era of leaders raised up to rescue Israel from its repeated turning away, showing a deep need for a true king.' },
  Ruth: { theme: 'Loyal love', author: 'Unknown', date: 'c. 1000 BC', summary: 'A tender story of a foreign widow whose loyalty places her in the family line of King David — and ultimately of Jesus.' },
  '1 Samuel': { theme: 'Rise of kingship', author: 'Samuel / others', date: 'c. 1000 BC', summary: 'From Samuel to Saul to the young David, Israel gets its first kings and learns what kind of heart God looks for.' },
  '2 Samuel': { theme: 'David’s reign', author: 'Unknown', date: 'c. 970 BC', summary: 'David unites the kingdom and receives a lasting promise, yet his failures show that even the best leaders need grace.' },
  '1 Kings': { theme: 'Kingdom divided', author: 'Unknown', date: 'c. 560 BC', summary: 'Solomon’s temple and wisdom give way to a split kingdom, with prophets like Elijah confronting unfaithful kings.' },
  '2 Kings': { theme: 'Decline & exile', author: 'Unknown', date: 'c. 560 BC', summary: 'The long slide of both kingdoms into exile, interrupted by moments of reform and the ministry of Elisha.' },
  '1 Chronicles': { theme: 'Retelling for hope', author: 'Traditionally Ezra', date: 'c. 450 BC', summary: 'A priestly retelling of David’s reign for the returned exiles, emphasizing worship and God’s enduring promises.' },
  '2 Chronicles': { theme: 'Temple & kings', author: 'Traditionally Ezra', date: 'c. 450 BC', summary: 'The story of Judah’s kings centered on the temple, ending with a hopeful call to return and rebuild.' },
  Ezra: { theme: 'Return & rebuild', author: 'Traditionally Ezra', date: 'c. 450 BC', summary: 'Exiles return from Babylon to rebuild the temple and renew their commitment to God’s law.' },
  Nehemiah: { theme: 'Rebuilding walls', author: 'Nehemiah / Ezra', date: 'c. 430 BC', summary: 'Nehemiah leads the rebuilding of Jerusalem’s walls and a spiritual renewal among the people.' },
  Esther: { theme: 'Hidden providence', author: 'Unknown', date: 'c. 470 BC', summary: 'In exile, a Jewish queen risks her life to save her people — a story where God’s name is never mentioned but his hand is everywhere.' },
  Job: { theme: 'Suffering & trust', author: 'Unknown', date: 'Unknown (ancient)', summary: 'A righteous man loses everything and wrestles honestly with God about suffering, meeting mystery rather than easy answers.' },
  Psalms: { theme: 'Prayer & praise', author: 'David & others', date: 'c. 1000–400 BC', summary: 'Israel’s songbook — 150 poems of praise, lament, thanksgiving, and trust that give words to every human emotion.' },
  Proverbs: { theme: 'Practical wisdom', author: 'Solomon & others', date: 'c. 950–700 BC', summary: 'Short, memorable sayings for living wisely, honestly, and skillfully in everyday life.' },
  Ecclesiastes: { theme: 'Meaning of life', author: 'Traditionally Solomon', date: 'c. 950 BC', summary: 'A searching reflection on life’s fleeting nature that finds meaning in reverence for God amid life’s uncertainties.' },
  'Song of Solomon': { theme: 'Love & devotion', author: 'Traditionally Solomon', date: 'c. 950 BC', summary: 'A poetic celebration of romantic love, long read also as a picture of devoted love between God and his people.' },
  Isaiah: { theme: 'Judgment & hope', author: 'Isaiah', date: 'c. 700 BC', summary: 'Sweeping prophecies of warning and comfort, rich with promises of a coming servant who would save.' },
  Jeremiah: { theme: 'Faithful warning', author: 'Jeremiah', date: 'c. 600 BC', summary: 'The “weeping prophet” warns of coming exile while promising a new covenant written on the heart.' },
  Lamentations: { theme: 'Grief & mercy', author: 'Traditionally Jeremiah', date: 'c. 586 BC', summary: 'Raw poems mourning Jerusalem’s fall, yet clinging to the truth that God’s mercies are new every morning.' },
  Ezekiel: { theme: 'Glory & renewal', author: 'Ezekiel', date: 'c. 580 BC', summary: 'Vivid visions in exile of judgment, God’s departing and returning glory, and dry bones brought to life.' },
  Daniel: { theme: 'Faith under pressure', author: 'Daniel', date: 'c. 530 BC', summary: 'Stories and visions of staying faithful in a foreign empire, confident that God rules over all kingdoms.' },
  Hosea: { theme: 'Relentless love', author: 'Hosea', date: 'c. 750 BC', summary: 'Through a heartbreaking marriage, God pictures his faithful love for an unfaithful people.' },
  Joel: { theme: 'Day of the Lord', author: 'Joel', date: 'c. 800 BC', summary: 'A locust plague becomes a call to return to God, with a promise of his Spirit poured out on all people.' },
  Amos: { theme: 'Justice', author: 'Amos', date: 'c. 760 BC', summary: 'A shepherd-prophet thunders against injustice and empty religion, calling for justice to roll like a river.' },
  Obadiah: { theme: 'Pride & downfall', author: 'Obadiah', date: 'c. 586 BC', summary: 'The Bible’s shortest book, a sharp warning to proud Edom for gloating over Jerusalem’s fall.' },
  Jonah: { theme: 'Mercy for all', author: 'Unknown', date: 'c. 760 BC', summary: 'A reluctant prophet learns that God’s compassion reaches even his enemies — the great city of Nineveh.' },
  Micah: { theme: 'Justice & humility', author: 'Micah', date: 'c. 730 BC', summary: 'Warnings against corruption alongside the famous call to do justice, love mercy, and walk humbly with God.' },
  Nahum: { theme: 'God’s justice', author: 'Nahum', date: 'c. 650 BC', summary: 'A poem announcing the fall of violent Nineveh, assuring the oppressed that evil will not stand forever.' },
  Habakkuk: { theme: 'Living by faith', author: 'Habakkuk', date: 'c. 610 BC', summary: 'An honest dialogue with God about injustice, resolving in the trust that “the righteous shall live by faith.”' },
  Zephaniah: { theme: 'Day of the Lord', author: 'Zephaniah', date: 'c. 630 BC', summary: 'A call to seek God before the coming day of judgment, ending with a song of restoration and joy.' },
  Haggai: { theme: 'First things first', author: 'Haggai', date: 'c. 520 BC', summary: 'A short, pointed call to the returned exiles to rebuild God’s temple and reorder their priorities.' },
  Zechariah: { theme: 'Hope restored', author: 'Zechariah', date: 'c. 520 BC', summary: 'Visions encouraging the rebuilders, pointing forward to a humble coming king.' },
  Malachi: { theme: 'Return to God', author: 'Malachi', date: 'c. 430 BC', summary: 'The Old Testament’s final word — a call to renewed faithfulness and a promise of a coming messenger.' },
  Matthew: { theme: 'Jesus the King', author: 'Traditionally Matthew', date: 'c. AD 60', summary: 'Presents Jesus as the promised Messiah and teacher, fulfilling Israel’s hopes, including the Sermon on the Mount.' },
  Mark: { theme: 'Jesus the servant', author: 'Traditionally Mark', date: 'c. AD 55', summary: 'The shortest, fastest-paced Gospel, showing Jesus in action as the powerful yet suffering servant.' },
  Luke: { theme: 'Jesus for all', author: 'Luke the physician', date: 'c. AD 60', summary: 'A carefully researched account highlighting Jesus’ compassion for the poor, outsiders, and forgotten.' },
  John: { theme: 'Jesus the Son of God', author: 'Traditionally John', date: 'c. AD 90', summary: 'A reflective Gospel built around signs and “I am” sayings, written so readers may believe and have life.' },
  Acts: { theme: 'The church begins', author: 'Luke the physician', date: 'c. AD 62', summary: 'The Spirit-empowered spread of the good news from Jerusalem outward, following Peter and then Paul.' },
  Romans: { theme: 'The gospel explained', author: 'Paul', date: 'c. AD 57', summary: 'Paul’s fullest explanation of the good news — sin, grace, faith, and new life for both Jews and Gentiles.' },
  '1 Corinthians': { theme: 'Church problems', author: 'Paul', date: 'c. AD 55', summary: 'Practical wisdom for a divided, gifted church, including the famous chapter on love.' },
  '2 Corinthians': { theme: 'Strength in weakness', author: 'Paul', date: 'c. AD 56', summary: 'A personal letter defending Paul’s ministry and showing how God’s power works through human weakness.' },
  Galatians: { theme: 'Freedom in Christ', author: 'Paul', date: 'c. AD 49', summary: 'A passionate defense of grace: we are made right with God by faith, not by rule-keeping.' },
  Ephesians: { theme: 'Unity in Christ', author: 'Paul', date: 'c. AD 60', summary: 'A vision of God’s grand plan to unite everything in Christ, and how the church lives it out.' },
  Philippians: { theme: 'Joy', author: 'Paul', date: 'c. AD 61', summary: 'A warm thank-you letter from prison, radiating joy and contentment in every circumstance.' },
  Colossians: { theme: 'Christ supreme', author: 'Paul', date: 'c. AD 60', summary: 'A letter exalting the supremacy of Christ over all things and warning against hollow philosophies.' },
  '1 Thessalonians': { theme: 'Living in hope', author: 'Paul', date: 'c. AD 51', summary: 'Encouragement to a young church to keep faithful and hopeful in light of Christ’s return.' },
  '2 Thessalonians': { theme: 'Steady endurance', author: 'Paul', date: 'c. AD 51', summary: 'Clarifying teaching about the last days and urging steady, responsible living meanwhile.' },
  '1 Timothy': { theme: 'Leading the church', author: 'Paul', date: 'c. AD 63', summary: 'Guidance to a young pastor on sound teaching, leadership, and godly conduct.' },
  '2 Timothy': { theme: 'Finish faithfully', author: 'Paul', date: 'c. AD 64', summary: 'Paul’s moving final letter, urging Timothy to guard the truth and endure hardship.' },
  Titus: { theme: 'Good works', author: 'Paul', date: 'c. AD 63', summary: 'Instructions for ordering churches and living out grace with integrity.' },
  Philemon: { theme: 'Forgiveness', author: 'Paul', date: 'c. AD 60', summary: 'A short, personal appeal to welcome back a runaway slave as a beloved brother.' },
  Hebrews: { theme: 'Christ is better', author: 'Unknown', date: 'c. AD 65', summary: 'Shows how Jesus surpasses everything that came before, urging weary believers to keep trusting.' },
  James: { theme: 'Faith that works', author: 'James, Jesus’ brother', date: 'c. AD 48', summary: 'Down-to-earth wisdom insisting that real faith shows up in how we live, speak, and treat others.' },
  '1 Peter': { theme: 'Hope in suffering', author: 'Peter', date: 'c. AD 63', summary: 'Encouragement to scattered, suffering believers to stand firm with living hope.' },
  '2 Peter': { theme: 'Guard the truth', author: 'Peter', date: 'c. AD 65', summary: 'A warning against false teachers and a call to grow in genuine knowledge of Christ.' },
  '1 John': { theme: 'Love & assurance', author: 'Traditionally John', date: 'c. AD 90', summary: 'Warm assurance that those who trust Christ can know they belong to God — and should love one another.' },
  '2 John': { theme: 'Truth & love', author: 'Traditionally John', date: 'c. AD 90', summary: 'A brief note urging believers to walk in both truth and love, and to beware deceivers.' },
  '3 John': { theme: 'Hospitality', author: 'Traditionally John', date: 'c. AD 90', summary: 'A short, personal letter commending faithful hospitality and warning against pride.' },
  Jude: { theme: 'Contend for faith', author: 'Jude, Jesus’ brother', date: 'c. AD 65', summary: 'An urgent call to defend the faith against those who twist grace into license.' },
  Revelation: { theme: 'God makes all new', author: 'Traditionally John', date: 'c. AD 95', summary: 'A vision of cosmic conflict and final victory, ending with God dwelling with his people in a renewed creation.' },
};
