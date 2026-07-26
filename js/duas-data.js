// NurDua: Datenmodell aller kuratierten Koran-Bittgebete
// sura/ayahs werden auch für die Audio-Wiedergabe (everyayah.com) genutzt.
// audioStart (Sekunden, optional): Startpunkt innerhalb des ersten Verses,
// falls unser Textausschnitt nicht am Versanfang beginnt (z.B. nach "qala"
// oder längerem Erzählteil).
// audioEnd (Sekunden, optional): Stopppunkt innerhalb des letzten Verses,
// falls der Vers nach unserem Textausschnitt noch weitergeht (z.B. Erzähl-
// Fortsetzung wie "...so vergab Er ihm" nach einer Dua).
// Beide ermittelt über die Wort-Zeitstempel der quran.com API
// (Alafasy-Rezitation, deckt sich mit everyayah.com).

const DUAS = [
  {
    id: "q2-201",
    sura: 2, ayahs: [201],
    category: "persoenlich",
    audioStart: 3.3,
    arabic: `رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ`,
    translit: `Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar.`,
    translation: `Unser Herr, gib uns Gutes in diesem Leben und Gutes im Jenseits, und bewahre uns vor der Strafe des Feuers.`
  },
  {
    id: "q17-24",
    sura: 17, ayahs: [24],
    category: "persoenlich",
    audioStart: 5.33,
    arabic: `رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا`,
    translit: `Rabbi-rhamhuma kama rabbayani saghira.`,
    translation: `Mein Herr, erbarme Dich meiner Eltern, wie sie mich klein großgezogen haben.`
  },
  {
    id: "q25-74",
    sura: 25, ayahs: [74],
    category: "persoenlich",
    audioStart: 2.71,
    arabic: `رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا`,
    translit: `Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin wa-j'alna lil-muttaqina imama.`,
    translation: `Unser Herr, schenke uns von unseren Partnern und unseren Nachkommen Augentrost, und mache uns zu Vorbildern für die Gottesfürchtigen.`
  },
  {
    id: "q2-127-128",
    sura: 2, ayahs: [127, 128],
    category: "persoenlich",
    audioStart: 6.96,
    arabic: `رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ ۞ رَبَّنَا وَاجْعَلْنَا مُسْلِمَيْنِ لَكَ وَمِن ذُرِّيَّتِنَا أُمَّةً مُّسْلِمَةً لَّكَ وَأَرِنَا مَنَاسِكَنَا وَتُبْ عَلَيْنَا ۖ إِنَّكَ أَنتَ التَّوَّابُ الرَّحِيمُ`,
    translit: `Rabbana taqabbal minna, innaka anta as-sami'u al-'alim. Rabbana wa-j'alna muslimayni laka wa min dhurriyyatina ummatan muslimatan laka wa arina manasikana wa tub 'alayna, innaka anta at-tawwabu ar-rahim.`,
    translation: `Unser Herr, nimm dies von uns an. Du bist der Allhörende, der Allwissende. Unser Herr, mache uns beide Dir ergeben, und aus unserer Nachkommenschaft eine Dir ergebene Gemeinschaft. Und zeige uns, wie wir Dich anbeten sollen und wende uns deine Gnade wieder zu; denn wahrlich, Du bist der gnädig Sich-wieder-Zuwendende, der Barmherzige.`,
    note: `Ibrahim & Ismail, beim Bau der Kaaba`
  },
  {
    id: "q14-35",
    sura: 14, ayahs: [35],
    category: "schutz",
    audioStart: 2.82,
    arabic: `رَبِّ اجْعَلْ هَـٰذَا الْبَلَدَ آمِنًا وَاجْنُبْنِي وَبَنِيَّ أَن نَّعْبُدَ الْأَصْنَامَ`,
    translit: `Rabbi-j'al hadha al-balada aminan wa-jnubni wa baniyya an na'buda al-asnam.`,
    translation: `Mein Herr, mache dieses Land sicher, und bewahre mich und meine Söhne davor, Götzen anzubeten.`,
    note: `Ibrahim`
  },
  {
    id: "q14-40-41",
    sura: 14, ayahs: [40, 41],
    category: "persoenlich",
    arabic: `رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ ۞ رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ`,
    translit: `Rabbi-j'alni muqima as-salati wa min dhurriyyati, rabbana wa taqabbal du'a'. Rabbana-ghfir li wa liwalidayya wa lil-mu'minina yawma yaqumu al-hisab.`,
    translation: `Mein Herr, mache mich zu einem, der das Gebet verrichtet, und auch aus meiner Nachkommenschaft. Unser Herr, und nimm mein Bittgebet an. Unser Herr, vergib mir und meinen Eltern und den Gläubigen am Tag, an dem die Abrechnung stattfindet.`,
    note: `Ibrahim`
  },
  {
    id: "q26-83-87",
    sura: 26, ayahs: [83, 84],
    category: "kraft",
    arabic: `رَبِّ هَبْ لِي حُكْمًا وَأَلْحِقْنِي بِالصَّالِحِينَ ۞ وَاجْعَل لِّي لِسَانَ صِدْقٍ فِي الْآخِرِينَ`,
    translit: `Rabbi hab li hukman wa alhiqni bis-salihin. Wa-j'al li lisana sidqin fi al-akhirin.`,
    translation: `Mein Herr, schenke mir Urteilskraft und füge mich den Rechtschaffenen bei. Und gib mir einen wahrhaftigen Ruf bei den späteren Generationen.`,
    note: `Ibrahim`
  },
  {
    id: "q37-100",
    sura: 37, ayahs: [100],
    category: "persoenlich",
    arabic: `رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ`,
    translit: `Rabbi hab li mina as-salihin.`,
    translation: `Mein Herr, schenke mir einen Rechtschaffenen.`,
    note: `Ibrahim, Bitte um einen Sohn`
  },
  {
    id: "q7-151",
    sura: 7, ayahs: [151],
    category: "vergebung",
    audioStart: 0.68,
    arabic: `رَبِّ اغْفِرْ لِي وَلِأَخِي وَأَدْخِلْنَا فِي رَحْمَتِكَ ۖ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ`,
    translit: `Rabbi-ghfir li wa li-akhi wa adkhilna fi rahmatika wa anta arhamu ar-rahimin.`,
    translation: `Mein Herr, vergib mir und meinem Bruder und lass uns in Deine Barmherzigkeit eingehen. Du bist der Barmherzigste der Barmherzigen.`,
    note: `Musa, nach dem goldenen Kalb`
  },
  {
    id: "q20-25-28",
    sura: 20, ayahs: [25, 26, 27, 28],
    category: "kraft",
    audioStart: 0.74,
    arabic: `رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي`,
    translit: `Rabbi-shrah li sadri wa yassir li amri wa-ahlu 'uqdatan min lisani yafqahu qawli.`,
    translation: `Mein Herr, weite mir meine Brust und erleichtere mir meine Angelegenheit, und löse einen Knoten aus meiner Zunge, damit sie meine Worte verstehen.`,
    audioEnd: 24,
    note: `Musa`
  },
  {
    id: "q28-16",
    sura: 28, ayahs: [16],
    category: "vergebung",
    audioStart: 0.69,
    audioEnd: 5.89,
    arabic: `رَبِّ إِنِّي ظَلَمْتُ نَفْسِي فَاغْفِرْ لِي`,
    translit: `Rabbi inni zalamtu nafsi fa-ghfir li.`,
    translation: `Mein Herr, ich habe mir selbst Unrecht getan, so vergib mir.`,
    note: `Musa`
  },
  {
    id: "q28-21",
    sura: 28, ayahs: [21],
    category: "schutz",
    audioStart: 7.79,
    arabic: `رَبِّ نَجِّنِي مِنَ الْقَوْمِ الظَّالِمِينَ`,
    translit: `Rabbi najjini mina-l-qawmi az-zalimin.`,
    translation: `Mein Herr, rette mich vor dem ungerechten Volk.`,
    note: `Musa, auf der Flucht`
  },
  {
    id: "q28-24",
    sura: 28, ayahs: [24],
    category: "persoenlich",
    audioStart: 7.77,
    arabic: `رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ`,
    translit: `Rabbi inni lima anzalta ilayya min khayrin faqir.`,
    translation: `Mein Herr, ich bin bedürftig nach jedem Guten, das Du zu mir herabsendest.`,
    note: `Musa, bei Madyan`
  },
  {
    id: "q11-47",
    sura: 11, ayahs: [47],
    category: "schutz",
    audioStart: 0.62,
    arabic: `رَبِّ إِنِّي أَعُوذُ بِكَ أَنْ أَسْأَلَكَ مَا لَيْسَ لِي بِهِ عِلْمٌ ۖ وَإِلَّا تَغْفِرْ لِي وَتَرْحَمْنِي أَكُن مِّنَ الْخَاسِرِينَ`,
    translit: `Rabbi inni a'udhu bika an as'alaka ma laysa li bihi 'ilm, wa illa taghfir li wa tarhamni akun mina al-khasirin.`,
    translation: `Mein Herr, ich suche Zuflucht bei Dir davor, Dich um etwas zu bitten, worüber ich kein Wissen habe. Und wenn Du mir nicht vergibst und Dich meiner nicht erbarmst, gehöre ich zu den Verlierern.`,
    note: `Nuh`
  },
  {
    id: "q71-28",
    sura: 71, ayahs: [28],
    category: "vergebung",
    audioEnd: 9.87,
    arabic: `رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَن دَخَلَ بَيْتِيَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ`,
    translit: `Rabbi-ghfir li wa liwalidayya wa liman dakhala baytiya mu'minan wa lil-mu'minina wal-mu'minat.`,
    translation: `Mein Herr, vergib mir, meinen Eltern und jedem, der gläubig mein Haus betritt, und den gläubigen Männern und Frauen.`,
    note: `Nuh`
  },
  {
    id: "q21-87",
    sura: 21, ayahs: [87],
    category: "kraft",
    audioStart: 13.28,
    arabic: `لَّا إِلَـٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ`,
    translit: `La ilaha illa anta subhanaka inni kuntu mina az-zalimin.`,
    translation: `Es gibt keinen Gott außer Dir, gepriesen bist Du, ich war einer der Ungerechten.`,
    note: `Yunus, im Bauch des Fisches`
  },
  {
    id: "q21-83",
    sura: 21, ayahs: [83],
    category: "kraft",
    audioStart: 5.07,
    arabic: `أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ`,
    translit: `Anni massaniya ad-durru wa anta arhamu ar-rahimin.`,
    translation: `Mich hat Leid getroffen, und Du bist der Barmherzigste der Barmherzigen.`,
    note: `Ayyub (Hiob), von Krankheit geplagt`
  },
  {
    id: "q21-89",
    sura: 21, ayahs: [89],
    category: "persoenlich",
    audioStart: 5.15,
    arabic: `رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنتَ خَيْرُ الْوَارِثِينَ`,
    translit: `Rabbi la tadharni fardan wa anta khayru al-warithin.`,
    translation: `Mein Herr, lass mich nicht allein, Du bist der beste Erbe.`,
    note: `Zakariyya`
  },
  {
    id: "q3-38",
    sura: 3, ayahs: [38],
    category: "persoenlich",
    audioStart: 5.35,
    arabic: `رَبِّ هَبْ لِي مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً ۖ إِنَّكَ سَمِيعُ الدُّعَاءِ`,
    translit: `Rabbi hab li min ladunka dhurriyyatan tayyibatan, innaka sami'u ad-du'a.`,
    translation: `Mein Herr, schenke mir von Dir aus eine gute Nachkommenschaft, Du bist der Erhörer des Bittgebets.`,
    note: `Zakariyya`
  },
  {
    id: "q12-101",
    sura: 12, ayahs: [101],
    category: "vergebung",
    audioStart: 20.51,
    truncated: true,
    arabic: `[...] تَوَفَّنِي مُسْلِمًا وَأَلْحِقْنِي بِالصَّالِحِينَ`,
    translit: `[...] Tawaffani musliman wa alhiqni bis-salihin.`,
    translation: `[...] Lass mich als Ergebenen sterben und füge mich den Rechtschaffenen bei.`,
    note: `Yusuf, am Ende seiner Geschichte`
  },
  {
    id: "q27-19",
    sura: 27, ayahs: [19],
    category: "persoenlich",
    audioStart: 6.45,
    arabic: `رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ`,
    translit: `Rabbi awzi'ni an ashkura ni'mataka allati an'amta 'alayya wa 'ala walidayya wa an a'mala salihan tardahu wa adkhilni bi-rahmatika fi 'ibadika as-salihin.`,
    translation: `Mein Herr, veranlasse mich, Dir für Deine Gnade zu danken, die Du mir und meinen Eltern erwiesen hast, und Rechtschaffenes zu tun, das Dir gefällt. Und lass mich durch Deine Barmherzigkeit unter Deine rechtschaffenen Diener eingehen.`,
    note: `Sulayman`
  },
  {
    id: "q38-35",
    sura: 38, ayahs: [35],
    category: "vergebung",
    audioStart: 0.59,
    arabic: `رَبِّ اغْفِرْ لِي وَهَبْ لِي مُلْكًا لَّا يَنبَغِي لِأَحَدٍ مِّنْ بَعْدِي ۖ إِنَّكَ أَنتَ الْوَهَّابُ`,
    translit: `Rabbi-ghfir li wa hab li mulkan la yanbaghi li-ahadin min ba'di, innaka anta al-wahhab.`,
    translation: `Mein Herr, vergib mir und schenke mir eine Herrschaft, wie sie niemandem nach mir geziemt. Du bist der Freigebige.`,
    note: `Sulayman`
  },
  {
    id: "q26-169",
    sura: 26, ayahs: [169],
    category: "schutz",
    arabic: `رَبِّ نَجِّنِي وَأَهْلِي مِمَّا يَعْمَلُونَ`,
    translit: `Rabbi najjini wa ahli mimma ya'malun.`,
    translation: `Mein Herr, rette mich und meine Angehörigen vor dem, was sie tun.`,
    note: `Lut`
  },
  {
    id: "q29-30",
    sura: 29, ayahs: [30],
    category: "schutz",
    audioStart: 0.57,
    arabic: `رَبِّ انصُرْنِي عَلَى الْقَوْمِ الْمُفْسِدِينَ`,
    translit: `Rabbi-nsurni 'ala al-qawmi al-mufsidin.`,
    translation: `Mein Herr, hilf mir gegen das Volk, das Unheil stiftet.`,
    note: `Lut`
  },
  {
    id: "q66-11",
    sura: 66, ayahs: [11],
    category: "persoenlich",
    audioStart: 7.29,
    arabic: `رَبِّ ابْنِ لِي عِندَكَ بَيْتًا فِي الْجَنَّةِ وَنَجِّنِي مِن فِرْعَوْنَ وَعَمَلِهِ وَنَجِّنِي مِنَ الْقَوْمِ الظَّالِمِينَ`,
    translit: `Rabbi-bni li 'indaka baytan fi al-jannati wa najjini min Fir'awna wa 'amalihi wa najjini mina al-qawmi az-zalimin.`,
    translation: `Mein Herr, baue mir bei Dir ein Haus im Paradies, und rette mich vor Pharao und seinem Tun, und rette mich vor dem ungerechten Volk.`,
    note: `Asiya, Frau des Pharao`
  },
  {
    id: "q3-53",
    sura: 3, ayahs: [53],
    category: "vergebung",
    arabic: `رَبَّنَا آمَنَّا بِمَا أَنزَلْتَ وَاتَّبَعْنَا الرَّسُولَ فَاكْتُبْنَا مَعَ الشَّاهِدِينَ`,
    translit: `Rabbana amanna bima anzalta wa-ttaba'na ar-rasula fa-ktubna ma'a ash-shahidin.`,
    translation: `Unser Herr, wir glauben an das, was Du herabgesandt hast, und wir folgen dem Gesandten. So verzeichne uns unter denen, die bezeugen.`,
    note: `Jünger 'Isas`
  },
  {
    id: "q5-83",
    sura: 5, ayahs: [83],
    category: "vergebung",
    audioStart: 16.69,
    arabic: `رَبَّنَا آمَنَّا فَاكْتُبْنَا مَعَ الشَّاهِدِينَ`,
    translit: `Rabbana amanna fa-ktubna ma'a ash-shahidin.`,
    translation: `Unser Herr, wir glauben. Verzeichne uns unter den Zeugen.`,
    note: `Leute der Schrift, beim Hören des Korans`
  },
  {
    id: "q2-250",
    sura: 2, ayahs: [250],
    category: "kraft",
    audioStart: 7.00,
    arabic: `رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ`,
    translit: `Rabbana afrigh 'alayna sabran wa thabbit aqdamana wa-nsurna 'ala al-qawmi al-kafirin.`,
    translation: `Unser Herr, gieße Geduld über uns aus, festige unsere Schritte und hilf uns gegen das ungläubige Volk.`
  },
  {
    id: "q2-286",
    sura: 2, ayahs: [286],
    category: "vergebung",
    audioStart: 9.57,
    arabic: `رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ`,
    translit: `Rabbana la tu'akhidhna in nasina aw akhta'na. Rabbana wa la tahmil 'alayna isran kama hamaltahu 'ala alladhina min qablina. Rabbana wa la tuhammilna ma la taqata lana bihi, wa-'fu 'anna wa-ghfir lana wa-rhamna, anta mawlana fa-nsurna 'ala al-qawmi al-kafirin.`,
    translation: `Unser Herr, belange uns nicht, wenn wir vergessen oder einen Fehler machen. Unser Herr, lege uns keine Last auf, wie Du sie denen auferlegt hast, die vor uns lebten. Unser Herr, lade uns nicht auf, wozu wir keine Kraft haben. Verzeihe uns, vergib uns und erbarme Dich unser. Du bist unser Schutzherr, so hilf uns gegen das ungläubige Volk.`
  },
  {
    id: "q3-8",
    sura: 3, ayahs: [8],
    category: "vergebung",
    arabic: `رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ`,
    translit: `Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahmatan, innaka anta al-wahhab.`,
    translation: `Unser Herr, lass unsere Herzen nicht abweichen, nachdem Du uns rechtgeleitet hast, und schenke uns Barmherzigkeit von Dir. Du bist der Freigebige.`
  },
  {
    id: "q3-16",
    sura: 3, ayahs: [16],
    category: "vergebung",
    audioStart: 2.64,
    arabic: `رَبَّنَا إِنَّنَا آمَنَّا فَاغْفِرْ لَنَا ذُنُوبَنَا وَقِنَا عَذَابَ النَّارِ`,
    translit: `Rabbana innana amanna fa-ghfir lana dhunubana wa qina 'adhaban-nar.`,
    translation: `Unser Herr, wir glauben, so vergib uns unsere Sünden und bewahre uns vor der Strafe des Feuers.`
  },
  {
    id: "q3-147",
    sura: 3, ayahs: [147],
    category: "vergebung",
    audioStart: 6.45,
    arabic: `رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ`,
    translit: `Rabbana-ghfir lana dhunubana wa israfana fi amrina wa thabbit aqdamana wa-nsurna 'ala al-qawmi al-kafirin.`,
    translation: `Unser Herr, vergib uns unsere Sünden und unser Übermaß in unserer Sache, festige unsere Schritte und hilf uns gegen das ungläubige Volk.`
  },
  {
    id: "q3-173",
    sura: 3, ayahs: [173],
    category: "kraft",
    audioStart: 18.16,
    arabic: `حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ`,
    translit: `Hasbunallahu wa ni'mal wakil.`,
    translation: `Allah genügt uns, und Er ist der beste Sachwalter.`
  },
  {
    id: "q3-191-194",
    sura: 3, ayahs: [191, 192, 193, 194],
    category: "vergebung",
    audioStart: 17.54,
    arabic: `رَبَّنَا مَا خَلَقْتَ هَـٰذَا بَاطِلًا سُبْحَانَكَ فَقِنَا عَذَابَ النَّارِ ۞ رَبَّنَا إِنَّكَ مَن تُدْخِلِ النَّارَ فَقَدْ أَخْزَيْتَهُ ۞ رَبَّنَا آتِنَا مَا وَعَدتَّنَا عَلَىٰ رُسُلِكَ وَلَا تُخْزِنَا يَوْمَ الْقِيَامَةِ ۖ إِنَّكَ لَا تُخْلِفُ الْمِيعَادَ`,
    translit: `Rabbana ma khalaqta hadha batilan subhanaka fa-qina 'adhaban-nar. Rabbana innaka man tudkhili an-nara faqad akhzaytah. Rabbana atina ma wa'adtana 'ala rusulika wa la tukhzina yawma al-qiyamati, innaka la tukhlifu al-mi'ad.`,
    translation: `Unser Herr, Du hast dies nicht umsonst erschaffen, gepriesen bist Du, bewahre uns vor der Strafe des Feuers. Unser Herr, wen Du ins Feuer eingehen lässt, den hast Du zuschanden gemacht. Unser Herr, gib uns, was Du uns durch Deine Gesandten versprochen hast, und mache uns am Tag der Auferstehung nicht zuschanden.`
  },
  {
    id: "q7-23",
    sura: 7, ayahs: [23],
    category: "vergebung",
    audioStart: 1.07,
    arabic: `رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ`,
    translit: `Rabbana zalamna anfusana wa in lam taghfir lana wa tarhamna lanakunanna mina al-khasirin.`,
    translation: `Unser Herr, wir haben uns selbst Unrecht getan. Und wenn Du uns nicht vergibst und Dich unser erbarmst, werden wir bestimmt zu den Verlierern gehören.`,
    note: `Adam & Hawwa`
  },
  {
    id: "q7-47",
    sura: 7, ayahs: [47],
    category: "schutz",
    audioStart: 13,
    arabic: `رَبَّنَا لَا تَجْعَلْنَا مَعَ الْقَوْمِ الظَّالِمِينَ`,
    translit: `Rabbana la taj'alna ma'a al-qawmi az-zalimin.`,
    translation: `Unser Herr, stelle uns nicht zu den Leuten, die Unrecht tun.`
  },
  {
    id: "q7-126",
    sura: 7, ayahs: [126],
    category: "kraft",
    audioStart: 18.06,
    arabic: `رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّنَا مُسْلِمِينَ`,
    translit: `Rabbana afrigh 'alayna sabran wa tawaffana muslimin.`,
    translation: `Unser Herr, gieße Geduld über uns aus und lass uns als Ergebene sterben.`,
    note: `Zauberer des Pharao, nach ihrer Bekehrung`
  },
  {
    id: "q18-10",
    sura: 18, ayahs: [10],
    category: "kraft",
    audioStart: 3.97,
    arabic: `رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا`,
    translit: `Rabbana atina min ladunka rahmatan wa hayyi' lana min amrina rashada.`,
    translation: `Unser Herr, lass uns Barmherzigkeit von Dir zukommen, und bereite uns aus unserer Angelegenheit einen rechten Ausweg.`,
    note: `Leute der Höhle`
  },
  {
    id: "q20-114",
    sura: 20, ayahs: [114],
    category: "persoenlich",
    audioStart: 14.34,
    arabic: `رَبِّ زِدْنِي عِلْمًا`,
    translit: `Rabbi zidni 'ilma.`,
    translation: `Mein Herr, mehre mein Wissen.`,
    note: `Musa`
  },
  {
    id: "q23-97-98",
    sura: 23, ayahs: [97, 98],
    category: "schutz",
    audioStart: 0.44,
    arabic: `رَبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ ۞ وَأَعُوذُ بِكَ رَبِّ أَن يَحْضُرُونِ`,
    translit: `Rabbi a'udhu bika min hamazati ash-shayatin, wa a'udhu bika rabbi an yahdurun.`,
    translation: `Mein Herr, ich suche Zuflucht bei Dir vor den Einflüsterungen der Satane, und ich suche Zuflucht bei Dir, mein Herr, davor, dass sie mir nahekommen.`
  },
  {
    id: "q23-109",
    sura: 23, ayahs: [109],
    category: "vergebung",
    audioStart: 6.77,
    arabic: `رَبَّنَا آمَنَّا فَاغْفِرْ لَنَا وَارْحَمْنَا وَأَنتَ خَيْرُ الرَّاحِمِينَ`,
    translit: `Rabbana amanna fa-ghfir lana wa-rhamna wa anta khayru ar-rahimin.`,
    translation: `Unser Herr, wir glauben, so vergib uns und erbarme Dich unser. Du bist der Beste derer, die sich erbarmen.`,
    note: `ähnlich auch in 23:118`
  },
  {
    id: "q25-65",
    sura: 25, ayahs: [65],
    category: "schutz",
    audioStart: 2.65,
    arabic: `رَبَّنَا اصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ ۖ إِنَّ عَذَابَهَا كَانَ غَرَامًا`,
    translit: `Rabbana-srif 'anna 'adhaba jahannama inna 'adhabaha kana gharama.`,
    translation: `Unser Herr, wende die Strafe der Hölle von uns ab. Ihre Strafe ist wahrlich bedrückend.`
  },
  {
    id: "q40-7-9",
    sura: 40, ayahs: [7, 8],
    category: "vergebung",
    audioStart: 13.88,
    audioEnd: 6.87,
    arabic: `رَبَّنَا وَسِعْتَ كُلَّ شَيْءٍ رَّحْمَةً وَعِلْمًا فَاغْفِرْ لِلَّذِينَ تَابُوا وَاتَّبَعُوا سَبِيلَكَ وَقِهِمْ عَذَابَ الْجَحِيمِ ۞ رَبَّنَا وَأَدْخِلْهُمْ جَنَّاتِ عَدْنٍ الَّتِي وَعَدتَّهُمْ`,
    translit: `Rabbana wasi'ta kulla shay'in rahmatan wa 'ilman fa-ghfir lilladhina tabu wa-ttaba'u sabilaka wa qihim 'adhaba al-jahim. Rabbana wa adkhilhum jannati 'adnin allati wa'adtahum.`,
    translation: `Unser Herr, Du umfasst alle Dinge mit Barmherzigkeit und Wissen, so vergib denen, die bereuen und Deinem Weg folgen, und bewahre sie vor der Pein der Hölle. Unser Herr, und lass sie eingehen in die Gärten Edens, die Du ihnen versprochen hast.`,
    note: `Fürbitte der Engel für die Gläubigen`
  },
  {
    id: "q44-12",
    sura: 44, ayahs: [12],
    category: "schutz",
    arabic: `رَبَّنَا اكْشِفْ عَنَّا الْعَذَابَ إِنَّا مُؤْمِنُونَ`,
    translit: `Rabbana-kshif 'anna al-'adhaba inna mu'minun.`,
    translation: `Unser Herr, nimm die Strafe von uns, wir sind gläubig.`
  },
  {
    id: "q59-10",
    sura: 59, ayahs: [10],
    category: "vergebung",
    audioStart: 7.76,
    arabic: `رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِّلَّذِينَ آمَنُوا رَبَّنَا إِنَّكَ رَءُوفٌ رَّحِيمٌ`,
    translit: `Rabbana-ghfir lana wa li-ikhwanina alladhina sabaquna bil-imani wa la taj'al fi qulubina ghillan lilladhina amanu rabbana innaka ra'ufun rahim.`,
    translation: `Unser Herr, vergib uns und unseren Brüdern, die uns im Glauben vorausgingen, und lass keinen Groll in unseren Herzen gegen die Gläubigen sein. Unser Herr, Du bist gütig und barmherzig.`
  },
  {
    id: "q66-8",
    sura: 66, ayahs: [8],
    category: "schutz",
    audioStart: 59.73,
    arabic: `رَبَّنَا أَتْمِمْ لَنَا نُورَنَا وَاغْفِرْ لَنَا ۖ إِنَّكَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ`,
    translit: `Rabbana atmim lana nurana wa-ghfir lana, innaka 'ala kulli shay'in qadir.`,
    translation: `Unser Herr, vervollständige unser Licht für uns und vergib uns, Du hast Macht zu allen Dingen.`
  },
  {
    id: "q17-80",
    sura: 17, ayahs: [80],
    category: "kraft",
    audioStart: 0.38,
    arabic: `رَبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ وَأَخْرِجْنِي مُخْرَجَ صِدْقٍ وَاجْعَل لِّي مِن لَّدُنكَ سُلْطَانًا نَّصِيرًا`,
    translit: `Rabbi adkhilni mudkhala sidqin wa akhrijni mukhraja sidqin wa-j'al li min ladunka sultanan nasira.`,
    translation: `Mein Herr, lass mich eintreten mit einem Eintritt der Wahrhaftigkeit und austreten mit einem Austritt der Wahrhaftigkeit, und gib mir von Dir aus eine unterstützende Kraft.`
  },
  {
    id: "q1-6-7",
    sura: 1, ayahs: [6, 7],
    category: "persoenlich",
    arabic: `اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۞ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ`,
    translit: `Ihdina as-sirata al-mustaqim. Sirata alladhina an'amta 'alayhim ghayri al-maghdubi 'alayhim wa la ad-dallin.`,
    translation: `Führe uns den geraden Weg, den Weg derer, denen Du Gnade erwiesen hast, nicht den Weg derer, die Deinen Zorn erregt haben, und nicht den der Irregehenden.`,
    note: `Al-Fatiha, wird in jedem Pflichtgebet rezitiert`
  },
  {
    id: "q60-4-5",
    sura: 60, ayahs: [4, 5],
    category: "kraft",
    audioStart: 51,
    arabic: `رَبَّنَا عَلَيْكَ تَوَكَّلْنَا وَإِلَيْكَ أَنَبْنَا وَإِلَيْكَ الْمَصِيرُ ۞ رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِّلَّذِينَ كَفَرُوا وَاغْفِرْ لَنَا رَبَّنَا إِنَّكَ أَنتَ الْعَزِيزُ الْحَكِيمُ`,
    translit: `Rabbana 'alayka tawakkalna wa ilayka anabna wa ilayka al-masir. Rabbana la taj'alna fitnatan lilladhina kafaru waghfir lana rabbana innaka anta al-'azeezu al-hakeem.`,
    translation: `Unser Herr, auf Dich verlassen wir uns, und Dir wenden wir uns reuig zu. Und zu Dir ist der Ausgang. Unser Herr, mache uns nicht zu einer Versuchung für diejenigen, die ungläubig sind. Und vergib uns, unser Herr. Du bist ja der Allmächtige und Allweise.`
  },
];

const CATEGORIES = [
  { id: "alle", label: "Alle" },
  { id: "vergebung", label: "Vergebung" },
  { id: "kraft", label: "Kraft" },
  { id: "schutz", label: "Schutz & Segen" },
  { id: "gelernt", label: "Gelernt", suffix: "✓" },
  { id: "favoriten", label: "Meine Duas", suffix: "♥" }
];
// Force redeploy - Sa, 25. Jul 2026 16:26:59
