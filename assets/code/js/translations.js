// Shared strings - used by header/footer on every page

const TRANSLATIONS_SHARED = {
	en: {
		nav_home: "home",
		social_title: "Find me here",

		nav_resources: "resources",
		rsrc_date: "new",

		nav_about: "about",

		footer_copy: "Ⓛ All lefts reserved.",

		lang_label: ":flag_pl:"
	},
	pl: {
		nav_home: "strona główna",
		social_title: "Tu mnie znajdziesz",

		nav_resources: "zasoby",
		rsrc_date: "nowość",

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
//   res_date                          -> "New" badge label
//   rsrc_<i1>_name      -> category heading
//   rsrc_<i1>_<i2>_*   -> card fields
//     _emote     -> emoji shown in the card header
//     _title     -> card title
//     _subtitle  -> optional subtitle (smaller text under the title)
//     _desc      -> card description (may contain HTML)
//     _url      -> card link target (anchor or URL)
//     _date       -> "1" to show the "New" badge
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
		rsrc_1_1_desc: "A curated collection of self-modified digital resources that have been used in my work.",
		rsrc_1_1_url: "https://github.com/KapturNaSluch/resources",
		rsrc_1_1_date: 1794700000,

		rsrc_1_2_emote: "🎙️",
		rsrc_1_2_title: "Gear",
		rsrc_1_2_desc: "A curated collection of equipment I've used in my work.",
		rsrc_1_2_url: "https://github.com/KapturNaSluch/resources/blob/main/internal/gear/list.md",
		rsrc_1_2_date: 1794700000,

		// Cards - 2
		rsrc_2_1_emote: "🖼️",
		rsrc_2_1_title: "Profile picture project",
		rsrc_2_1_desc: "",
		rsrc_2_1_url: "https://github.com/KapturNaSluch/resources/raw/refs/heads/main/internal/media/visual/avatar.7z",
		rsrc_2_1_date: 1794700000,

		rsrc_2_2_emote: "📚",
		rsrc_2_2_title: "External resources used",
		rsrc_2_2_desc: "A curated collection of resources from other creators that I rely on or refer to in my work.",
		rsrc_2_2_url: "https://github.com/KapturNaSluch/resources/blob/main/external/list.md",
		rsrc_2_2_date: 1794700000,
	},

	pl: {
		// Page header
		rsrc_desc: "Treści związane z moją twórczością.",

		// Sections
		rsrc_1_name: "Główne",
		rsrc_2_name: "Inne",

		// Cards - 1
		rsrc_1_1_emote: "🎨",
		rsrc_1_1_title: "Użyte zasoby wewnętrzne",
		rsrc_1_1_desc: "Wybrany zbiór zmodyfikowanych przeze mnie zasobów cyfrowych, które zostały użyte w moich pracach.",
		rsrc_1_1_url: "https://github.com/KapturNaSluch/resources/tree/main/internal/media",
		rsrc_1_1_date: 1794700000,

		rsrc_1_2_emote: "🎙️",
		rsrc_1_2_title: "Sprzęt",
		rsrc_1_2_desc: "Wybrany zbiór wyposażenia, którego użyłem podczas pracy.",
		rsrc_1_2_url: "https://github.com/KapturNaSluch/resources/blob/main/internal/gear/list.md",
		rsrc_1_2_date: 1794700000,

		// Cards - 2
		rsrc_2_1_emote: "🖼️",
		rsrc_2_1_title: "Projekt zdjęcia profilowego",
		rsrc_2_1_url: "https://github.com/KapturNaSluch/resources/raw/refs/heads/main/internal/media/visual/avatar.7z",
		rsrc_2_1_date: 1794700000,

		rsrc_2_2_emote: "📚",
		rsrc_2_2_title: "Użyte zasoby zewnętrzne",
		rsrc_2_2_desc: "Wybrany zbiór zasobów innych twórców, na których polegam bądź do których odnoszę się w swoich pracach.",
		rsrc_2_2_url: "https://github.com/KapturNaSluch/resources/blob/main/external/list.md",
		rsrc_2_2_date: 1794700000,
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
		qa_1_1_q: "When did you start posting content?",
		qa_1_1_a: "Toward the end of 2025, I started posting my content on one of the popular social media platforms that features vertical-format videos.",

		// Questions - 2: Profile
		qa_2_1_q: "Where did the username come from?",
		qa_2_1_a: "From a lack of creativity - the location during the period when I began my public activity was cold, and due to my innate tendency to fall into various kinds of illness, a head covering didn't seem like a stupid idea.<br><br>It was THE idea itself that was stupid - providing really very little protection against low temperatures. It was the <span class=\"logo\">Kaptur</span> (pol. <span class=\"logo\">Kaptur</span>), and knowing the content I decided to focus on at the time, the name <span class=\"logo\">Kaptur<span>Na</span>Słuch</span> (lit. <span class=\"logo\">Hood<span>On</span>Hearing</span>) wasn't hard to come up with.",

		// Questions - 3: Content
		qa_3_1_q: "Why do you make videos about these particular subjects?",
		qa_3_1_a: "Sound accompanied me through half of my youth and will stay with me until the end of my life.<br><br>Throughout my entire existence I have produced relatively few pieces, and today I can be described as a person in a state of rest.<br><br>After some time I decided that the only thing left for me, in a surge of uneducated, unsublimated, and unsubjected-to-the-standards-of-grandmaster-art drivel, would be to join their ranks, and then gradually inject my knowledge into them through precisely this kind of content.<br><br>Science and literature from unknown authors have stopped ruling human clarity of mind long time ago, and have no chance of reaching absolutely anyone.",

		qa_3_2_q: "Why is it so hard to understand you?",
		qa_3_2_a: "A very long time ago I was involved in a certain accident. That accident was learning my native language. Its consequence was completing all grades of primary school, and then acquiring the skill of so-called \"waffling\", which in the eyes of simple people causes disgust, and among the younger, confusion. Sometimes both, sometimes reversed, sometimes combined.<br><br>I dare say, however, that my vocabulary is at the highest world level, which cannot be compared to the number of works of fine literature whose content I have ever familiarized myself with. These can be counted on the fingers of two hands.<br><br>The last school reading I have read from cover to cover without the slightest grimace of discouragement was titled \"The Boys of Paul Street\". I was at most 13 years old at the time.<br><br>However, with the moment I completed my education, I began to appreciate my native language more, and to avoid ALL borrowings and(!) neologisms far and wide, though I am not so fiercely stubborn in my bad writing to force myself to use archaisms.<br><br>I think that this is precisely the reason why my content is difficult to absorb - I can use the language of a wise person, whereas the dialect of the modern consumer is a foreign concept to me.<br><br>If, however, my statements were read aloud, they would be registered by all listeners, but interpreted and absorbed by consecutively smaller groups of people.",

		qa_3_3_q: "How do you deal with unfair criticism?",
		qa_3_3_a: "Envy toward me is my daily bread. I am a person banned on at least five audiophile forums. So, as one can guess, expressing my own views comes too easily to me.<br><br>The target audience environment of my content despises intelligent people. Its members consist of people who gained their experience through practice, for which they had to prepare by tediously studying theory.<br>One of their problems - aside from ego and narcissism preceding logic by light years - is the lack of desire for further knowledge acquirement. I think that no one in their right mind appends the highest academic titles before their name in order to expand their experience further. Even if those titles are made up.<br><br><br>My difference in views combined with the ability for coherent reasoning and flowery vocabulary are precisely what the people who describe themselves with the aforementioned, elite prefixes, fear the most.<br><br>There exists a certain very interesting boundary in human reasoning, after crossing which the ability to think logically turns into fear. This can be compared to debates between individuals with extreme good and bad views - the former have - for lack of better words - \"flushed\" a certain fragment of memory in the mind, which in the latter is occupied by a non-zero amount of data constituting the majority of the opponent's head content.<br><br>Radicals, however, have at least one basic defense mechanism, the use of which depends on the amount of logical arguments they encounter. The length of the fuse used to ignite it is regulated by the opponent.<br><br>This mechanism is called fury.<br>",

		qa_3_4_q: "To what extent do statistics influence what topics you choose for subsequent publications?",
		qa_3_4_a: "Numbers in the public space are merely values in databases and cannot be a component that determines both the quality of life and the priority of work that needs to be done.<br><br>Or at least I imagine that people with a three-digit IQ think that way. As it happens, mine consists of exactly that many digits.",

		qa_3_5_q: "What does your work on the video look like?",
		qa_3_5_a: "<ol><li>First I have to find an idea, and then write a draft of the script.</li><li>After that I give it to several popular artificial intelligence models to check.</li><li>After applying sometimes hundreds of manual corrections, I try to find a free time to go in front of the camera.</li><li>Once I have it, I need to dress up.</li><li>Then connect the appropriate equipment and start recording.</li><li>Afterward comes the matter of transferring the material to the computer...</li><li>...and editing it.<br>This process can take even several dozen days.</li><li>In the meantime, I handle audio processing<br>This is the only fully automated process.</li><li>After processing the sound files, it's time to export the video...</li><li>...and in the meantime, create the thumbnail.<br>It's a trifle and therefore the most pleasant moment in the creative process, which takes me no more than an hour to complete.</li><li>After transferring the finished data to a mobile device, the final steps are:<li>adjusting the subtitles style, their lengths, create description... and publication date.</li></li></ol>",

		qa_3_6_q: "Where do you draw inspiration from?",
		qa_3_6_a: "From everything that surrounds me and that I can connect to the topics I speak about. And moreover...<br><br><div class=\"blockquote\"><span>\"A person sometimes believes he's seen all the way to the bottom of the well of human stupidity, and a reminder that that well apparently has no bottom is sometimes useful.\"</span><span>Stephen King</span></div><br>This quote is particularly close to me because it reminds me that there will ALWAYS be someone who, in a TRULY extreme situation, I can criticize.<br><br>In my work I try to be confrontational with everything I possibly can, but there is a certain group that I treat with an enormous - for my temperament - dose of tolerance.<br><br>That group is called people.",

		qa_3_7_q: "Do you have any material \"in the drawer\" that you put a lot of work into but ultimately never published?",
		qa_3_7_a: "Unpublished content is an inseparable consequence of self-criticism and development, at least in art.<br><br>Projects whose publication has been halted remain in that state mainly due to an insufficiently thought-out script, which - upon further reflection - can be written much better.",

		qa_3_8_q: "In what direction would you like to develop your activity in two or three years?",
		qa_3_8_a: "I wouldn't.<br><br>I view radically new things either as a threat or as something that requires thorough preparation, and I already devote a tremendous amount of time to create content.<br>Furthermore, I don't like surprises.",

		qa_3_9_q: "If you could go back in time and give yourself one piece of advice before adding your first post, what would it be?",
		qa_3_9_a: "<div class=\"blockquote\"><span>Invest in a camera, good lighting, and adapters. Lots of adapters.</span>",

		qa_3_10_q: "What is the average payment you receive for a single post?",
		qa_3_10_a: "None.<br><br>The platforms where I'm active either don't give me that possibility or I don't meet their criteria in that regard."
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
		qa_1_1_a: "Toward the end of 2025, I started posting my content on one of the popular social media platforms that features vertical-format videos.",

		// Questions - 2: Profil
		qa_2_1_q: "Skąd wzięła się nazwa użytkownika?",
		qa_2_1_a: "Z braku kreatywności - lokalizacja w okresie w którym rozpocząłem swoją publiczną działalność była chłodna, a z uwagi na moją wrodzoną skłonność do popadania w różnego rodzaju choroby, to nakrycie głowy nie wydawało się głupim pomysłem.<br><br>Głupim pomysłem było ono samo - zapewniające naprawdę niewielką ochronę przed niskimi temperaturami. Był nim <span class=\"logo\">Kaptur</span>, a znając zawartość treści, na których postanowiłem się wówczas skupić nazwa <span class=\"logo\">Kaptur<span>Na</span>Słuch</span> nie była trudna do wymyślenia.",

		// Questions - 3: Treści
		qa_3_1_q: "Dlaczego robisz filmy akurat o takiej tematyce?",
		qa_3_1_a: "Dźwięk towarzyszył mi przez połowę mojej młodości i pozostanie ze mną do końca życia. Natomiast nazwanie tego małżeństwem byłoby nieodpowiednie - nie tylko przez dzisiejszy stan sztuki muzycznej, ale też dlatego że ten związek zawiera się głównie pomiędzy ludźmi.<br><br>Przez cały okres mojego jestestwa wyprodukowałem względnie mało utworów, a dziś można mnie określić jako osobę w stanie spoczynku.<br><br>Po jakimś czasie uznałem, że jedynym, co mi pozostaje w przypływie niewyedukowanego, niewysublimowanego oraz niepodporządkowanego wobec standardów arcymistrzowskiej sztuki barachła, będzie wstąpienie w ich szeregi, a następnie stopniowe wstrzykiwanie weń swojej wiedzy poprzez właśnie tego typu filmy.<br><br>Nauka oraz tekst od nieznajomych autorów już dawno przestały rządzić ludzką trzeźwością umysłu i nie mają szans na dotarcie do absolutnie kogokolwiek.",

		qa_3_2_q: "Dlaczego tak ciężko Cię zrozumieć?",
		qa_3_2_a: "Bardzo dawno temu uczestniczyłem w pewnym wypadku. Wypadek ten nosił nazwę nauki języka ojczystego. Jego konsekwencją było ukończenie wszystkich klas szkoły podstawowej, a następnie nabycie umiejętności tzw. \"lania wody\", która w oczach prostych osób powoduje wstręt, a wśród młodszych zmieszanie. Czasami jednocześnie, a czasem na odwrót.<br><br>Śmiem jednak twierdzić, że mój słownik jest na najwyższym światowym poziomie, którego nie można przyrównać do ilości dzieł literatury pięknej, z których treścią kiedykolwiek się zapoznałem. Te można bowiem policzyć na palcach dwóch rąk.<br><br>Ostatnia lektura szkolna, którą przeczytałem od deski do deski bez najmniejszego grymasu zniechęcenia nosiła tytuł \"Chłopcy z Placu Broni\". Miałem wówczas maksymalnie 13 lat.<br><br>Wraz z momentem ukończenia przeze mnie edukacji zacząłem jednak bardziej doceniać swój język ojczysty, a WSZELKIE zapożyczenia oraz(!) neologizmy omijać szerokim łukiem, choć nie jestem w swojej grafomanii na tyle zacietrzewiony, by zmuszać się do używania archaizmów.<br><br>Myślę, że to jest właśnie powód, dla którego moje treści są trudne do przyswojenia - potrafię posługiwać się językiem mędrca, natomiast dialekt współczesnego odbiorcy jest dla mnie pojęciem obcym.<br><br>Gdyby jednak przeczytać moje wypowiedzi na głos, to zostałyby one zarejestrowane przez wszystkich słuchaczy, ale zinterpretowane i przyswojone przez kolejno mniejsze grupy osób.",

		qa_3_3_q: "Jak radzisz sobie z niesprawiedliwą krytyką?",
		qa_3_3_a: "Zawiść wobec mnie jest dla mnie chlebem powszednim. Jestem osobą zbanowaną na co najmniej pięciu forach audiofilskich. Jak można się więc domyślić wyrażanie własnych poglądów przychodzi mi zbyt łatwo.<br><br>Docelowe środowisko odbiorców moich treści gardzi ludźmi inteligentnymi. Jego członkowie składają się z osób, które swoje doświadczenie pozyskali w praktyce, co do której musieli się przygotowywać poprzez żmudne studiowanie teorii.<br>Jednym z ich problemów - pomijając ego oraz narcyzm wyprzedzające logikę o lata świetlne - jest brak chęci do zdobywania dalszej wiedzy. Myślę że nikt o zdrowych zmysłach nie dopisuje sobie najwyższych tytułów naukowych przed nazwiskiem, aby jeszcze dalej poszerzać swoje doświadczenie. Nawet jeśli te tytuły są bez pokrycia.<br><br><br>Moja odmienność w poglądach połączona z umiejętnością spójnego rozumowania oraz kwieciste słownictwo są właśnie tym, czego osoby określające się wyżej wymienionymi, bo elitarnymi przedrostkami, boją się najbardziej.<br><br>Istnieje pewna bardzo interesująca granica w ludzkim rozumowaniu, po przekroczeniu której umiejętność logicznego myślenia zamienia się w strach. Można to przyrównać do debat jednostek o skrajnych poglądach dobrych i złych - pierwsze mają - z braku lepszych słów - \"przeczyszczony\" pewien fragment pamięci w pamięci, który u drugich jest zajęty przez niezerową ilość danych stanowiącą większość zawartości głowy przeciwnika.<br><br>Radykałowie jednak mają co najmniej jeden podstawowy mechanizm obronny, którego użycie jest uzależnione od ilości logicznych argumentów, z jakimi się zetkną. Długość lontu, który służy do jego podpalenia jest zaś regulowana przez oponenta.<br><br>Mechanizm ten nosi nazwę furia.<br>",

		qa_3_4_q: "Na ile statystyki wpływają na to, jakie tematy wybierasz do kolejnych publikacji?",
		qa_3_4_a: "Liczby w przestrzeni medialnej są jedynie wartościami w bazach danych i nie mogą być składową, która określa zarówno jakość życia, jak i priorytet pracy, która jest do wykonania.<br><br>A przynajmniej wyobrażam sobie, że ludzie z trzycyfrowym ilorazem inteligencji tak właśnie myślą. Tak się składa że mój składa się z właśnie tylu cyfr.",

		qa_3_5_q: "Jak wygląda Twoja praca nad filmem?",
		qa_3_5_a: "<ol><li>Najpierw muszę znaleźć pomysł, a następnie napisać szkic scenariusza.</li><li>Po tym daje go kilku popularnym modelom sztucznej inteligencji do sprawdzenia.</li><li>Po zastosowaniu nieraz setek ręcznych poprawek próbuję znaleźć wolny termin na wyjście przed kamerę.</li><li>Gdy już go mam, muszę przygotować swoją charakteryzację.</li><li>Dalej podłączyć odpowiedni sprzęt i zacząć nagrywać.</li><li>Później przychodzi kwestia przerzucenia materiału na komputer...</li><li>...oraz zmontowanie go.<br>Ten proces może zająć nawet kilkadziesiąt dni.</li><li>W międzyczasie zajmuję się obróbką audio<br>Jest to jedyny proces w pełni zautomatyzowany.</li><li>Po przetworzeniu plików dźwiękowych nadchodzi czas na wyeksportowanie filmu...</li><li>...a w międzyczasie tworzenie miniatury.<br>To błahostka a zatem najprzyjemniejszy moment w procesie twórczym, który nie zajmuje mi więcej niż godziny na ukończenie.</li><li>Po transferze gotowych danych na urządzenie mobilne, końcowe czynności to:<li>dostosowanie styli napisów, ich długości, stworzenie opisu... oraz ustalenie data publikacji.</li></li></ol>",

		qa_3_6_q: "Skąd czerpiesz inspiracje?",
		qa_3_6_a: "Ze wszystkiego co mnie otacza, a co mogę powiązać z tematami, na które się wypowiadam. A ponadto...<br><br><div class=\"blockquote\"><span>\"Czasami człowiek sądzi, że ujrzał już dno studni ludzkiej głupoty, ale spotyka kogoś, dzięki komu dowiaduje się, że ta studnia jednak nie ma dna\".</span><span>Stephen King</span></div><br>Ten cytat jest mi szczególnie bliski, bo przypomina mi, że ZAWSZE znajdzie się ktoś, kogo w sytuacji NAPRAWDĘ skrajnej mogę skrytykować.<br><br>W swojej pracy staram się być konfliktowy ze wszystkim, z czym tylko mogę, ale jest pewna grupa którą traktuję z ogromną - jak na mój temperament - dozą tolerancji.<br><br>Grupą tą są ludzie.",

		qa_3_7_q: "Czy masz \"w szufladzie\" materiał, w który włożyłeś mnóstwo pracy, ale ostatecznie nigdy go nie opublikowałeś?",
		qa_3_7_a: "Nieopublikowane treści są nierozłączną konsekwencją samokrytyki oraz rozwoju, przynajmniej w sztuce.<br><br>Projekty, których publikacja została wstrzymana trwają w tym stanie głównie przez nieodpowiednio przemyślany scenariusz, który - po głębszej refleksji - można napisać znacznie lepiej.",

		qa_3_8_q: "W jakim kierunku chciałbyś rozwinąć swoją działalność za dwa lub trzy lata?",
		qa_3_8_a: "Nie chciałbym.<br><br>Uważam skrajnie nowe zjawiska albo za zagrożenie, albo jako coś, do czego należy podejść dobrze przygotowanym, a ja już i tak poświęcam ogromną ilość czasu na tworzenie treści.<br>A poza tym, nie lubię niespodzianek.",

		qa_3_9_q: "Gdybyś mógł cofnąć się w czasie i dać sobie jedną radę przed dodaniem pierwszego posta, co by to było?",
		qa_3_9_a: "<div class=\"blockquote\"><span>Zainwestuj w kamerę, dobre światło i przejściówki. Dużo przejściówek.</span>",

		qa_3_10_q: "Jakie jest przeciętne wynagrodzenie pieniężne, które otrzymujesz za jednen materiał?",
		qa_3_10_a: "Żadne.<br><br>Platformy, na których się udzielam albo nie dają mi możliwości zarobku, albo nie spełniam ich kryteriów w tym zakresie."
	},
};