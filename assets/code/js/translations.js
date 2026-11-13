// Shared strings - used by header/footer on every page

const TRANSLATIONS_SHARED = {
	en: {
		nav_home: "home",
		social_title: "Find me here",

		nav_resources: "resources",
		rsrc_new: "new",

		nav_about: "about",

		footer_copy: "Ⓛ All lefts reserved.",

		lang_label: ":flag_pl:"
	},
	pl: {
		nav_home: "strona główna",
		social_title: "Tu mnie znajdziesz",

		nav_resources: "zasoby",
		rsrc_new: "nowość",

		nav_about: "o mnie",

		footer_copy: "Ⓛ Wszystkie lewa zastrzeżone.",

		lang_label: ":flag_us:"
	},
};

// Index page

const TRANSLATIONS_INDEX = {
	en: {
		hero_tagline1: "Content creator",
		hero_tagline2: "Audio enthusiast",
		hero_desc: "One of the most controversial sound-related content creators on the Polish internet.",
		hero_cta: "Find me online",
		resources_link: "Resources",
	},

	pl: {
		hero_tagline1: "Twórca treści",
		hero_tagline2: "Pasjonat audio",
		hero_desc: "Jeden z najbardziej kontrowersyjnych twórców treści związanych z dźwiękiem w Polskim internecie.",
		hero_cta: "Znajdź mnie online",
		resources_link: "Zasoby",
	},
};

// Resources page
//
// Data model:
//   rsrc_title / rsrc_desc -> page header
//   res_new                          -> "New" badge label
//   rsrc_<i1>_name      -> category heading
//   rsrc_<i1>_<i2>_*   -> card fields
//     _emote     -> emoji shown in the card header
//     _title     -> card title
//     _subtitle  -> optional subtitle (smaller text under the title)
//     _desc      -> card description (may contain HTML)
//     _href      -> card link target (anchor or URL)
//     _new       -> "1" to show the "New" badge
//
// Order is derived from the numeric prefixes of the keys.

const TRANSLATIONS_RESOURCES = {
	en: {
		// Page header
		rsrc_desc: "Content associated with my work.",

		// Sections
		rsrc_1_name: "Main",
		rsrc_2_name: "Other",

		// Cards - 1
		rsrc_1_1_emote: "🎨",
		rsrc_1_1_title: "Internal resources used",
		rsrc_1_1_desc: "A curated collection of self-modified resources that have been used in my work.",
		rsrc_1_1_href: "https://github.com/KapturNaSluch/resources",
		rsrc_1_1_new: 1794597061,

		rsrc_1_2_emote: "🎙️",
		rsrc_1_2_title: "Gear",
		rsrc_1_2_desc: "A curated collection of equipment I've used in my work.",
		rsrc_1_2_href: "https://github.com/KapturNaSluch/resources/blob/main/internal/gear/list.md",
		rsrc_1_2_new: 1794597061,

		// Cards - 2
		rsrc_2_1_emote: "🖼️",
		rsrc_2_1_title: "Profile picture project",
		rsrc_2_1_desc: "",
		rsrc_2_1_href: "https://github.com/KapturNaSluch/resources/raw/refs/heads/main/internal/media/visual/avatar.7z",
		rsrc_2_1_new: 1794597061,

		rsrc_2_2_emote: "📚",
		rsrc_2_2_title: "External resources used",
		rsrc_2_2_desc: "A curated collection of resources from other creators that I rely on or refer to in my work.",
		rsrc_2_2_href: "https://github.com/KapturNaSluch/resources/blob/main/external/list.md",
		rsrc_2_2_new: 1794597061,
	},

	pl: {
		// Page header
		rsrc_desc: "Treści mojego autorstwa udostępnione publicznie, do ponownego wykorzystania.",

		// Sections
		rsrc_1_name: "Główne",
		rsrc_2_name: "Inne",

		// Cards - 1
		rsrc_1_1_emote: "🎨",
		rsrc_1_1_title: "Użyte zasoby wewnętrzne",
		rsrc_1_1_desc: "Wybrany zbiór zmodyfikowanych przez mnie zasobów, które zostały użyte w moich pracach.",
		rsrc_1_1_href: "https://github.com/KapturNaSluch/resources",
		rsrc_1_1_new: 1794597061,

		rsrc_1_2_emote: "🎙️",
		rsrc_1_2_title: "Sprzęt",
		rsrc_1_2_desc: "Wybrany zbiór wyposażenia, którego użyłem podczas pracy.",
		rsrc_1_2_href: "https://github.com/KapturNaSluch/resources/blob/main/internal/gear/list.md",
		rsrc_1_2_new: 1794597061,

		// Cards - 2
		rsrc_2_1_emote: "🖼️",
		rsrc_2_1_title: "Projekt zdjęcia profilowego",
		rsrc_2_1_href: "https://github.com/KapturNaSluch/resources/raw/refs/heads/main/internal/media/visual/avatar.7z",
		rsrc_2_1_new: 1794597061,

		rsrc_2_2_emote: "📚",
		rsrc_2_2_title: "Użyte zasoby zewnętrzne",
		rsrc_2_2_desc: "Wybrany zbiór zasobów innych twórców, na których polegam bądź do których odnoszę się w swoich pracach.",
		rsrc_2_2_href: "https://github.com/KapturNaSluch/resources/blob/main/external/list.md",
		rsrc_2_2_new: 1794597061,
	},
};

// About page
//
// Data model:
//   qa_pg_title / qa_pg_desc   -> page header
//   qa_<i1>_name                  -> category heading
//   qa_<i1>_desc                  -> optional small subtitle
//   qa_<i1>_<i2>_q               -> question text
//   qa_<i1>_<i2>_a               -> answer (may contain HTML)
//
// Order is derived from the numeric prefixes of the keys.

const TRANSLATIONS_ABOUT = {
	en: {
		// Page header
		qa_pg_desc: "Questions nobody asked, and answers nobody needed.",

		// Categories
		qa_1_name: "Beginnings",
		qa_1_desc: "",

		qa_2_name: "Profile",
		qa_2_desc: "",

		qa_3_name: "Content",
		qa_3_desc: "",

		// Questions - 1: Beginnings
		qa_1_1_q: "When did you start publishing your materials?",
		qa_1_1_a: "At the end of 2025 - I started publishing my content on one of the popular social platforms featuring vertical-format videos.",

		// Questions - 2: Profile
		qa_2_1_q: "Where did the username come from?",
		qa_2_1_a: "From a lack of creativity - the location where I started my public activity was cold, and given my innate tendency to catch various illnesses, a head covering didn't seem like a stupid idea.<br><br>The stupid idea was the covering itself - offering really very little protection against low temperatures. It was a <span class=\"logo\">Kaptur</span> (hood), and knowing the content I had decided to focus on at the time, the name <span class=\"logo\">Kaptur<span>Na</span>Słuch</span> wasn't hard to come up with.",

		// Questions - 3: Content
		qa_3_1_q: "Why do you make videos about this particular subject?",
		qa_3_1_a: "Sound accompanied me through half of my youth and will stay with me until the end of my life. Calling it a marriage would be inappropriate - not only because of the current state of musical art, but also because that union is mainly between people.<br><br>Throughout my existence I've produced very few tracks, and today I can be described as a person at rest.<br><br>After some time I decided that the only thing left for me, in a surge of uneducated, unrefined, and unsubordinated-to-the-standards-of-masterful-art rabble, was to join their ranks and then gradually inject my knowledge into them through exactly this kind of video.<br><br>Learning and text from unfamiliar authors long ago ceased to rule human mental sobriety and will reach absolutely no one.<br><br>In my works I try to be objective.",

		qa_3_2_q: "Why is it so hard to understand you?",
		qa_3_2_a: "A very long time ago I was involved in a certain accident. This accident was called education reform. Its consequence was completing all grades of primary school and, with that, acquiring the ability to 'beat around the bush', which in the eyes of simple people causes confusion, and among the young, disgust.<br><br>I dare say, however, that my vocabulary of the mother tongue is at the highest world level, which cannot be compared to the number of works of fine literature whose content I have ever become acquainted with. Those can be counted on the fingers of two hands.<br><br>The last school reading I read from cover to cover without the slightest grimace of discouragement was titled 'The Boys of Paul Street'. I was at most 13 years old at the time.<br><br>With the moment of my completing education, however, I began to appreciate my native language more, and I avoid ALL borrowings and(!) neologisms with a wide berth, although I'm not so fanatical about my writing that I'd force myself to use archaisms.<br><br>I think that's precisely why my content is hard to absorb - I can speak the language of an old man, while the dialect of the contemporary audience is a foreign concept to me.",

		qa_3_3_q: "How do you deal with unfair criticism?",
		qa_3_3_a: "Envy toward me is my daily bread. I am a person banned on at least five audiophile forums. So, as one might guess, expressing my own views comes all too easily to me.<br><br>The target audience environment of my content despises thinking people - its members consist of people who acquired their experience through practice, for which they had to prepare themselves through tedious study of theory.<br><br>My difference in views combined with the ability to think logically and flowery vocabulary is what people calling themselves with grand academic titles fear the most.<br><br>There exists a certain very interesting boundary in human reasoning, crossing which the ability to think logically turns into fear. One can compare it to debates between anti-theistic individuals and those marked by religion - the former have - for lack of better words - an 'emptied' certain fragment of memory in the brain, while in the latter it is occupied by a non-zero amount of data.<br><br>These radicals have at least one basic defense mechanism whose use depends on the degree of logic they encounter. The length of the fuse used to ignite it is regulated by the former.<br><br>This mechanism is called fury.<br><br>Guess which group I belong to.",

		qa_3_4_q: "How much do statistics influence what topics you choose for your next publications?",
		qa_3_4_a: "Numbers in the media are merely values in databases and cannot be the determining factor for both quality of life and work, which is a topic that needs to be explored.<br><br>Or at least, I imagine that people with a three-digit IQ think that way. I think mine happens to have that many digits.",

		qa_3_5_q: "What does your typical day of work on a piece look like, and without which tool or app can you not imagine operating?",
		qa_3_5_a: "<ol><li>First I have to find an idea for the piece and then write a script.</li><li>After that I give it to four popular AI models to check.</li><li>After applying sometimes hundreds of manual corrections I try to find a free slot to step in front of the camera.</li><li>Once I have one, I have to prepare my characterisation.</li><li>Then plug in the right equipment and start recording.</li><li>Later comes the matter of transferring the material to the computer...</li><li>...and editing it.<br>This process can take even dozens of days.</li><li>In the meantime I work on audio processing<br>The only fully automated step.</li><li>After swapping the sound files it's time to export the video...</li><li>...and in the meantime I work on the thumbnail.<br>It's trivial and the most pleasant moment in the creative process - it takes no more than an hour.</li><li>After transferring the finished files to a mobile device, the final steps are:<li>adjusting styles, subtitle length, the description... and finally publishing.</li></li></ol><br>Narrowing down the set of tools I use during the creative process would be inappropriate, however it is publicly available.",

		qa_3_6_q: "Where do you draw inspiration on days when your mind is blank and you lack motivation?",
		qa_3_6_a: "<div class=\"blockquote\"><span>\"Sometimes a man thinks he has already seen the bottom of the well of human stupidity, but then meets someone thanks to whom he learns that this well has no bottom after all.\"</span><span>Stephen King</span></div><br>This quote is especially close to me, because it reminds me that there will ALWAYS be someone I can refer to.",

		qa_3_7_q: "Do you have a piece in your drawer that you put a ton of work into but ultimately never published?",
		qa_3_7_a: "Unpublished content is an inseparable consequence of self-criticism and development in art.<br><br>Projects whose publication has been suspended remain in that state solely and exclusively because of an insufficiently thought-out script.",

		qa_3_8_q: "In what direction would you like to develop your activity in two or three years?",
		qa_3_8_a: "I wouldn't like to.",

		qa_3_9_q: "If you could go back in time and give yourself one piece of advice before publishing your first post, what would it be?",
		qa_3_9_a: "Invest in a camera, good lighting, and adapters. Lots of adapters.",

		qa_3_10_q: "How much do you earn from your content?",
		qa_3_10_a: "Nothing.<br><br>The platforms where I post either don't offer me that option or I don't meet their criteria in that regard."
	},

	pl: {
		// Page header
		qa_pg_desc: "Pytania, których nikt nie zadał, i odpowiedzi, których nikt nie potrzebował.",

		// Categories
		qa_1_name: "Początki",
		qa_1_desc: "",

		qa_2_name: "Profil",
		qa_2_desc: "",

		qa_3_name: "Treści",
		qa_3_desc: "",

		// Questions - 1: Początki
		qa_1_1_q: "Kiedy zacząłeś wstawiać materiały?",
		qa_1_1_a: "Pod koniec 2025 roku - rozpocząłem publikowanie swoich treści na jednej z popularnych platform społecznościowych zawierającej filmy w formacie pionowym.",

		// Questions - 2: Profil
		qa_2_1_q: "Skąd wzięła się nazwa użytkownika?",
		qa_2_1_a: "Z braku kreatywności - lokalizacja w okresie w którym rozpocząłem swoją publiczną działalność była chłodna, a z uwagi na moją wrodzoną skłonność do popadania w różnego rodzaju choroby, to nakrycie głowy nie wydawało się głupim pomysłem.<br><br>Głupim pomysłem było ono samo - zapewniające naprawdę niewielką ochronę przed niskimi temperaturami. Był nim <span class=\"logo\">Kaptur</span>, a znając zawartość treści, na których postanowiłem się wówczas skupić nazwa <span class=\"logo\">Kaptur<span>Na</span>Słuch</span> nie była trudna do wymyślenia.",

		// Questions - 3: Treści
		qa_3_1_q: "Dlaczego robisz filmy akurat o takiej tematyce?",
		qa_3_1_a: "Dźwięk towarzyszył mi przez połowę mojej młodości i pozostanie ze mną do końca życia. Natomiast nazwanie tego małżeństwem byłoby nieodpowiednie - nie tylko przez dzisiejszy stan sztuki muzycznej, ale też dlatego że ten związek zawiera się głównie pomiędzy ludźmi.<br><br>Przez cały okres mojego jestestwa wyprodukowałem mało utworów, a dziś można mnie określić jako osobę w stanie spoczynku.<br><br>Po jakimś czasie uznałem, że jedynym, co mi pozostaje w przypływie niewyedukowanego, niewysublimowanego oraz niepodporządkowanego wobec standardów arcymistrzowskiej sztuki barachła, będzie wstąpienie w ich szeregi, a następnie stopniowe wstrzykiwanie weń swojej wiedzy poprzez właśnie tego typu filmy.<br><br>Nauka oraz tekst od nieznajomych autorów już dawno przestały rządzić ludzką trzeźwością umysłu i nie dotrą do absolutnie nikogo.<br><br>W swoich pracach staram się być obiektywny.",

		qa_3_2_q: "Dlaczego tak ciężko Cię zrozumieć?",
		qa_3_2_a: "Bardzo dawno temu uczestniczyłem w pewnym wypadku. Wypadek ten nosił nazwę reformy szkolnictwa. Jego konsekwencją było ukończenie wszystkich klas szkoły podstawowej, a co za tym idzie nabycie umiejętności \"lania wody\", która w oczach prostych osób powoduje zmieszanie, a wśród młodych wstręt.<br><br>Śmiem jednak twierdzić, że mój słownik języka ojczystego jest na najwyższym światowym poziomie, którego nie można przyrównać do ilości dzieł literatury pięknej, z których treścią kiedykolwiek się zapoznałem. Te można bowiem policzyć na palcach dwóch rąk.<br><br>Ostatnia lektura szkolna, którą przeczytałem od deski do deski bez najmniejszego grymasu zniechęcenia nosiła tytuł \"Chłopcy z Placu Broni\". Miałem wówczas maksymalnie 13 lat.<br><br>Wraz z momentem ukończenia przeze mnie edukacji zacząłem jednak bardziej doceniać swój język ojczysty, a WSZELKIE zapożyczenia oraz(!) neologizmy omijam szerokim łukiem.<br><br>Myślę, że to jest właśnie powód, dla którego moje treści są trudne do przyswojenia - potrafię posługiwać się językiem starego człowieka, natomiast dialekt współczesnego odbiorcy jest dla mnie pojęciem obcym.",

		qa_3_3_q: "Jak radzisz sobie z niesprawiedliwą krytyką?",
		qa_3_3_a: "Zawiść wobec mnie jest dla mnie chlebem powszednim. Jestem osobą zbanowaną na co najmniej pięciu forach audiofilskich. Jak można się więc domyślić wyrażanie własnych poglądów przychodzi mi zbyt łatwo.<br><br>Docelowe środowisko odbiorców moich treści gardzi ludźmi myślącymi - jego członkowie składają się z osób, które swoje doświadczenie pozyskali w praktyce, co do której musieli się przygotować poprzez żmudne studiowanie teorii.<br><br>Moja odmienność w poglądach połączona z umiejętnością logicznego myślenia oraz kwiecistym słownictwem jest tym, czego osoby określające się górnolotnymi tytułami naukowymi boją się najbardziej.<br><br>Istnieje pewna bardzo interesująca granica w ludzkim rozumowaniu, po przekroczeniu której umiejętność logicznego myślenia zamienia się w strach. Można to przyrównać do debat jednostek anty-teistycznych z tymi nacechowanymi religijnie - pierwsze mają - z braku lepszych słów - \"opróżniony\" pewien fragment pamięci w mózgu, zaś u drugich jest on zajęty przez niezerową ilość danych.<br><br>Radykałowie ci mają co najmniej jeden podstawowy mechanizm obronny, którego użycie jest uzależnione od stopnia logiki, z jaką się zetkną. Długość lontu, który służy do jego podpalenia jest zaś regulowana przeze tych pierwszych.<br><br>Mechanizm ten nosi nazwę furia.<br><br>Zgadnijcie, do której grupy należę.",

		qa_3_4_q: "Na ile statystyki wpływają na to, jakie tematy wybierasz do kolejnych publikacji?",
		qa_3_4_a: "Liczby w przestrzeni medialnej są jedynie wartościami w bazach danych i nie mogą być składową określającą zarówno jakość życia, jak i pracy, która jest do opracowania.<br><br>A przynajmniej wyobrażam sobie, że ludzie z trzycyfrowym ilorazem inteligencji myślą w taki sposób. Myślę że mój właśnie składa się z tylu cyfr.",

		qa_3_5_q: "Jak wygląda Twój typowy dzień pracy nad materiałem i bez jakiego narzędzia lub aplikacji nie wyobrażasz sobie działania?",
		qa_3_5_a: "<ol><li>Najpierw muszę znaleźć pomysł na dany materiał a potem napisać scenariusz.</li><li>Po tym daje go czterem popularnym modelom sztucznej inteligencji do sprawdzenia.</li><li>Po zastosowaniu nieraz setek ręcznych poprawek próbuję znaleźć wolny termin na wyjście przed kamerę.</li><li>Gdy już go mam, muszę przygotować swoją charakteryzację.</li><li>Dalej podłączyć odpowiedni sprzęt i zacząć nagrywać.</li><li>Później przychodzi kwestia przerzucenia materiału na komputer...</li><li>...oraz zmontowanie go.<br>Ten proces może zająć nawet kilkadziesiąt dni.</li><li>W międzyczasie zajmuję się obróbką audio<br>Jedyny proces w pełni zautomatyzowany.</li><li>Po zamianie plików dźwiękowych przychodzi czas na wyeksportowanie filmu...</li><li>...a w międzyczasie zajmuje się tworzeniem miniatury.<br>To błahostka i najprzyjemniejszy moment w procesie twórczym - nie zajmuje mi on więcej niż godziny.</li><li>Po transferze gotowych plików na urządzenie mobilne końcowymi czynnościami są:<li>dostosowanie styli, długości napisów, opisu... oraz wreszcie publikacja.</li></li></ol><br>Zawężenie zbioru narzędzi, z których korzystam podczas procesu twórczego byłoby nieodpowiednie, jednak jest on publicznie dostępny.",

		qa_3_6_q: "Skąd czerpiesz inspiracje w dniach, kiedy masz pustkę w głowie i brakuje Ci weny?",
		qa_3_6_a: "<div class=\"blockquote\"><span>\"Czasami człowiek sądzi, że ujrzał już dno studni ludzkiej głupoty, ale spotyka kogoś, dzięki komu dowiaduje się, że ta studnia jednak nie ma dna\".</span><span>Stephen King</span></div><br>Ten cytat jest mi szczególnie bliski, bo przypomina mi, że ZAWSZE znajdzie się ktoś, do kogo mogę się odnieść.",

		qa_3_7_q: "Czy masz w szufladzie materiał, w który włożyłeś mnóstwo pracy, ale ostatecznie nigdy go nie opublikowałeś?",
		qa_3_7_a: "Nieopublikowane treści są w sztuce nierozłączną konsekwencją samokrytyki oraz rozwoju.<br><br>Projekty, których publikacja została wstrzymana trwają w tym stanie tylko i wyłącznie przez nieodpowiednio przemyślany scenariusz.",

		qa_3_8_q: "W jakim kierunku chciałbyś rozwinąć swoją działalność za dwa lub trzy lata?",
		qa_3_8_a: "Nie chciałbym.",

		qa_3_9_q: "Gdybyś mógł cofnąć się w czasie i dać sobie jedną radę przed publikacją pierwszego wpisu, co by to było?",
		qa_3_9_a: "Zainwestuj w kamerę, dobre światło i przejściówki. Dużo przejściówek.",

		qa_3_10_q: "Ile zarabiasz na swoich treściach?",
		qa_3_10_a: "Nic.<br><br>Platformy, na których się udzielam albo nie dają mi takiej możliwości lub nie spełniam ich kryteriów w tym zakresie."
	},
};
