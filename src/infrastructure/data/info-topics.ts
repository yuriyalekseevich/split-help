import type { InfoLink, InfoTopic } from '@/domain/info-topic';
import type { LocalizedString } from '@/domain/service';

/**
 * Seed topics for the file repository.
 * Import this module only from file-info-repository.ts.
 * Pages must use `infoRepository`.
 */

const published = new Date('2026-03-01T08:00:00.000Z');

function text(en: string, ru: string, hr: string, uk: string): LocalizedString {
  return { en, ru, hr, uk };
}

const shortStay = text(
  'Mostly short stays.',
  'В основном короткие заезды.',
  'Uglavnom kratki najam.',
  'Здебільшого коротке проживання.',
);

const agency = text(
  'Listings from an agency.',
  'Объявления агентства.',
  'Oglasi agencije.',
  'Оголошення агентства.',
);

const portal = text(
  'Another place to browse listings.',
  'Ещё одна площадка с объявлениями.',
  'Još jedno mjesto s oglasima.',
  'Ще один майданчик з оголошеннями.',
);

const zagreb = text(
  'Rentals in Zagreb, not Split.',
  'Аренда в Загребе, не в Сплите.',
  'Najam u Zagrebu, ne u Splitu.',
  'Оренда в Загребі, не у Спліті.',
);

const groupNote = text(
  'A Facebook group. Read the newest posts before you write to anyone.',
  'Группа в Facebook. Прочитайте свежие посты, прежде чем кому-то писать.',
  'Grupa na Facebooku. Pročitajte novije objave prije nego što nekome pišete.',
  'Група у Facebook. Прочитайте свіжі дописи, перш ніж комусь писати.',
);

function site(
  id: string,
  url: string,
  label: string,
  note?: LocalizedString,
  featured = false,
): InfoLink {
  return { id, url, label, kind: 'site', note, featured: featured || undefined };
}

function group(id: string, url: string, label: string): InfoLink {
  return { id, url, label, kind: 'group', note: groupNote };
}

export const infoTopics: InfoTopic[] = [
  {
    id: 'info_where-to-look',
    slug: 'where-to-look',
    title: text(
      'Where to look for a flat or a house',
      'Где искать квартиру или дом',
      'Gdje tražiti stan ili kuću',
      'Де шукати квартиру або будинок',
    ),
    summary: text(
      'Njuškalo first, then other sites and Facebook groups.',
      'Сначала Njuškalo, потом другие сайты и группы в Facebook.',
      'Prvo Njuškalo, zatim druge stranice i grupe na Facebooku.',
      'Спершу Njuškalo, далі інші сайти і групи у Facebook.',
    ),
    body: text(
      'Open Njuškalo first. It has the widest list of flats and houses.\n\nThe other sites are agencies, listing portals, and places for a short stay. A few are about Zagreb more than Split, so check the city before you write.\n\nFacebook groups move quickly. Read the newest posts, and don’t pay anyone before you have seen the place.',
      'Сначала откройте Njuškalo. Там самый большой список квартир и домов.\n\nДальше идут агентства, площадки с объявлениями и сайты для короткого заезда. Некоторые больше про Загреб, чем про Сплит, так что проверьте город, прежде чем писать.\n\nВ группах Facebook объявления появляются быстро. Смотрите свежие посты и не переводите деньги, пока не увидите жильё.',
      'Prvo otvorite Njuškalo. Ondje je najširi popis stanova i kuća.\n\nOstale stranice su agencije, portali s oglasima i mjesta za kratki najam. Neke su više o Zagrebu nego o Splitu, pa provjerite grad prije nego što pišete.\n\nGrupe na Facebooku brzo se mijenjaju. Čitajte novije objave i nemojte nikome plaćati prije nego što vidite stan.',
      'Спершу відкрийте Njuškalo. Там найбільший список квартир і будинків.\n\nДалі агентства, майданчики з оголошеннями і сайти для короткого проживання. Деякі більше про Загреб, ніж про Спліт, тож перевірте місто, перш ніж писати.\n\nУ групах Facebook оголошення з’являються швидко. Дивіться свіжі дописи і не переказуйте гроші, поки не побачите житло.',
    ),
    links: [
      site(
        'link_njuskalo',
        'https://www.njuskalo.hr/',
        'Njuškalo',
        text(
          'The widest list of flats and houses. Start here.',
          'Самый большой список квартир и домов. Начните отсюда.',
          'Najširi popis stanova i kuća. Počnite ovdje.',
          'Найбільший список квартир і будинків. Почніть звідси.',
        ),
        true,
      ),
      site('link_booking', 'https://www.booking.com/', 'Booking.com', shortStay),
      site('link_airbnb', 'https://www.airbnb.com/', 'Airbnb', shortStay),
      site('link_expedia', 'https://www.expedia.com/', 'Expedia', shortStay),
      site('link_lider', 'https://www.lider.hr/', 'Lider', portal),
      site('link_elite', 'https://www.elite-nekretnine.hr/', 'Elite nekretnine', agency),
      site('link_smartchoice', 'https://www.smartchoice.hr/', 'Smart Choice', agency),
      site('link_dogma', 'https://www.dogma-nekretnine.hr/', 'Dogma nekretnine', agency),
      site('link_dux', 'https://www.dux-nekretnine.hr/', 'Dux nekretnine', agency),
      site('link_index', 'https://www.index.hr/', 'Index.hr', portal),
      site('link_indomio', 'https://www.indomio.hr/', 'Indomio', portal),
      site('link_crozilla', 'https://www.crozilla.com/', 'Crozilla', portal),
      site('link_midoma', 'https://mi-doma.hr/', 'Mi-doma', portal),
      site('link_rentinzagreb', 'https://www.rentinzagreb.com/', 'Rent in Zagreb', zagreb),
      site('link_longterm', 'https://www.longtermlettings.com/', 'Long Term Lettings', portal),
      site(
        'link_realestatecroatia',
        'https://www.realestatecroatia.com/',
        'Real Estate Croatia',
        portal,
      ),
      group('link_fb_1721538721427457', 'https://www.facebook.com/groups/1721538721427457/', 'Facebook group'),
      group('link_fb_476860309839602', 'https://www.facebook.com/groups/476860309839602/', 'Facebook group'),
      group('link_fb_104285043291395', 'https://www.facebook.com/groups/104285043291395/', 'Facebook group'),
      group('link_fb_623074287719229', 'https://www.facebook.com/groups/623074287719229/', 'Facebook group'),
      group('link_fb_najamsplit', 'https://www.facebook.com/groups/najamsplit/', 'Najam Split'),
      group('link_fb_splithomerent', 'https://www.facebook.com/groups/splithomerent/', 'Split Home Rent'),
    ],
    visible: true,
    sortOrder: 1,
    createdAt: published,
    updatedAt: published,
  },
  {
    id: 'info_mup-appointment',
    slug: 'mup-appointment',
    title: text(
      'How to book a MUP appointment in Split',
      'Как взять номерок в MUP в Сплите',
      'Kako rezervirati termin u MUP-u u Splitu',
      'Як взяти номерок у MUP у Спліті',
    ),
    summary: text(
      'Book online and skip the queue that starts before 4 in the morning.',
      'Запишитесь онлайн и не стойте в очереди, которая начинается до четырёх утра.',
      'Rezervirajte online i preskočite red koji kreće prije četiri ujutro.',
      'Запишіться онлайн і не стійте в черзі, яка починається до четвертої ранку.',
    ),
    body: text(
      'We got to the MUP in Split at five minutes to four in the morning and were already fifteenth in line.\n\nFree slots on the site show up early, usually around 4:30.\n\nDo not press Rezerviraj before 5:00. If you do, after 5:00 the site can answer with an error along the lines of “too many attempts”.\n\nSlots are usually taken four or five days ahead, and often only one date is open.',
      'Мы пришли в MUP в Сплите без пяти минут четыре утра и уже были пятнадцатыми.\n\nСвободные номерки на сайте появляются рано утром, обычно около 4:30.\n\nНе нажимайте «Rezerviraj» до 5:00. Если нажать раньше, после пяти сайт может выдать ошибку вроде «слишком много попыток».\n\nКак правило, всё занято на 4–5 дней вперёд, и для записи открыта только одна дата.',
      'Došli smo u MUP u Splitu u 3:55 i već smo bili petnaesti u redu.\n\nSlobodni termini na stranici pojavljuju se rano ujutro, obično oko 4:30.\n\nNe pritišćite Rezerviraj prije 5:00. Ako pritisnete ranije, nakon 5:00 stranica može javiti grešku u stilu „previše pokušaja”.\n\nObično je sve zauzeto četiri do pet dana unaprijed, a za rezervaciju je često otvoren samo jedan datum.',
      'Ми прийшли в MUP у Спліті за п’ять хвилин до четвертої ранку і вже були п’ятнадцятими в черзі.\n\nВільні номерки на сайті з’являються рано-вранці, зазвичай близько 4:30.\n\nНе натискайте «Rezerviraj» до 5:00. Якщо натиснути раніше, після п’ятої сайт може показати помилку на кшталт «забагато спроб».\n\nЗазвичай усе зайнято на 4–5 днів наперед, і для запису відкрита лише одна дата.',
    ),
    links: [
      site(
        'link_redomat',
        'https://redomat.mup.hr/',
        'redomat.mup.hr',
        text(
          'The page where you book the appointment.',
          'Страница, где бронируют номерок.',
          'Stranica na kojoj se rezervira termin.',
          'Сторінка, де бронюють номерок.',
        ),
        true,
      ),
    ],
    visible: true,
    sortOrder: 2,
    createdAt: published,
    updatedAt: published,
  },
];
