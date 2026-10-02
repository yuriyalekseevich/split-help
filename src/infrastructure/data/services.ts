import type { LocalizedString, Service } from '@/domain/service';

/**
 * Seed services for the file repository.
 * Import this module only from file-service-repository.ts.
 * Pages and components must use `serviceRepository`.
 */

const published = new Date('2026-03-01T08:00:00.000Z');

function text(en: string, ru: string, hr: string, uk: string): LocalizedString {
  return { en, ru, hr, uk };
}

function lines(
  en: string[],
  ru: string[],
  hr: string[],
  uk: string[],
): LocalizedString {
  return {
    en: en.join('\n'),
    ru: ru.join('\n'),
    hr: hr.join('\n'),
    uk: uk.join('\n'),
  };
}

export const services: Service[] = [
  {
    id: 'svc_muzh-na-chas',
    slug: 'muzh-na-chas',
    title: text(
      'Handyman',
      'Муж на час',
      'Muškarac na sat',
      'Майстер на годину',
    ),
    shortDescription: text(
      'Small repairs and odd jobs at home in Split. We come ourselves.',
      'Мелкий ремонт и разовые работы по дому в Сплите. Приезжаем сами.',
      'Sitni popravci i majstorski poslovi po kući u Splitu. Dolazimo osobno.',
      'Дрібний ремонт і разові роботи вдома у Спліті. Приїжджаємо самі.',
    ),
    included: lines(
      [
        'We put up shelves, TVs, curtains, and mirrors',
        'We replace taps, locks, and lights',
        'Small fixes: doors, furniture, silicone, drips',
        'An extra pair of hands when something is heavy',
        'We agree what is included on site, before we start',
      ],
      [
        'Повесим полки, телевизор, карнизы и зеркала',
        'Заменим смеситель, замок или светильник',
        'Мелкий ремонт: двери, мебель, герметик, протечки',
        'Поможем поднять то, что одному тяжело',
        'Объём согласуем на месте, до начала работы',
      ],
      [
        'Montiramo police, televizore, zavjese i ogledala',
        'Mijenjamo slavine, brave i lampe',
        'Sitni popravci: vrata, namještaj, silikon, curenje',
        'Pomoć kad nešto treba podići u dvoje',
        'Što ulazi u posao, dogovorimo na licu mjesta prije početka',
      ],
      [
        'Повісимо полиці, телевізор, карнизи й дзеркала',
        'Замінимо змішувач, замок або світильник',
        'Дрібний ремонт: двері, меблі, герметик, протікання',
        'Допоможемо підняти те, що одному важко',
        'Обсяг узгодимо на місці, до початку роботи',
      ],
    ),
    priceHint: text(
      'from €25 an hour',
      'от 25 € в час',
      'od 25 € na sat',
      'від 25 € за годину',
    ),
    imageUrl: '/services/muzh-na-chas.jpg',
    visible: true,
    sortOrder: 1,
    createdAt: published,
    updatedAt: published,
  },
  {
    id: 'svc_sborka-mebeli',
    slug: 'sborka-mebeli',
    title: text(
      'Custom furniture and assembly',
      'Мебель на заказ и сборка',
      'Namještaj po mjeri i montaža',
      'Меблі на замовлення і складання',
    ),
    shortDescription: text(
      'We measure, design, and build a piece for your flat, or assemble something you already bought, including IKEA.',
      'Снимем размеры, придумаем и сделаем мебель под вашу квартиру. Или соберём то, что вы уже купили, включая IKEA.',
      'Uzimamo mjere, osmislimo i izradimo namještaj za vaš stan. Ili sastavimo ono što ste već kupili, uključujući IKEA.',
      'Знімемо розміри, придумаємо й зробимо меблі під вашу квартиру. Або зберемо те, що ви вже купили, зокрема IKEA.',
    ),
    included: lines(
      [
        'We come, measure, and agree what you need',
        'A sketch or a simple mock-up before we build',
        'We make it, bring it over, and fit it',
        'Or we assemble furniture you already bought, including IKEA',
        'Doors, drawers, and hinges adjusted on the spot',
      ],
      [
        'Приедем, снимем размеры и договоримся, что нужно',
        'До изготовления покажем эскиз или простой макет',
        'Сделаем, привезём и установим',
        'Или соберём мебель, которую вы уже купили, в том числе IKEA',
        'На месте отрегулируем дверцы, ящики и петли',
      ],
      [
        'Dolazimo, uzimamo mjere i dogovaramo što treba',
        'Prije izrade pokazujemo skicu ili jednostavan model',
        'Izrađujemo, dovozimo i montiramo',
        'Ili sastavljamo namještaj koji ste već kupili, uključujući IKEA',
        'Na licu mjesta podešavamo vrata, ladice i šarke',
      ],
      [
        'Приїдемо, знімемо розміри й домовимося, що потрібно',
        'До виготовлення покажемо ескіз або простий макет',
        'Зробимо, привеземо й встановимо',
        'Або зберемо меблі, які ви вже купили, зокрема IKEA',
        'На місці відрегулюємо дверцята, шухляди й петлі',
      ],
    ),
    priceHint: text(
      'a price after a photo or a quick look',
      'цену назовём по фото или после короткого осмотра',
      'cijenu javljamo nakon fotografije ili kratkog pregleda',
      'ціну назвемо за фото або після короткого огляду',
    ),
    imageUrl: '/services/sborka-mebeli.jpg',
    visible: true,
    sortOrder: 2,
    createdAt: published,
    updatedAt: published,
  },
  {
    id: 'svc_razvedka-kvartiry',
    slug: 'razvedka-kvartiry',
    title: text(
      'Check a flat before you rent it',
      'Проверка квартиры перед арендой',
      'Provjera stana prije najma',
      'Перевірка квартири перед орендою',
    ),
    shortDescription: text(
      'We go to the viewing for you and tell you what the photos leave out.',
      'Сходим на просмотр вместо вас и расскажем, чего не видно на фото.',
      'Odemo na razgledavanje umjesto vas i javimo što se na fotografijama ne vidi.',
      'Сходимо на огляд замість вас і розповімо, чого не видно на фото.',
    ),
    included: lines(
      [
        'We come at a time you set with the landlord',
        'Photos and a short written or voice note',
        'Damp, noise, light, storage, and the neighbours',
        'A look at the appliances, windows, and hot water',
        'A straight answer: take it, or keep looking',
      ],
      [
        'Придём, когда удобно вам и хозяину',
        'Фото и короткий рассказ — текстом или голосом',
        'Сырость, шум, свет, где хранить вещи, соседи',
        'Проверим технику, окна и горячую воду',
        'Честно скажем: брать или искать дальше',
      ],
      [
        'Dolazimo u terminu koji dogovorite s najmodavcem',
        'Fotografije i kratka poruka, napisana ili glasovna',
        'Vlaga, buka, svjetlo, prostor za odlaganje, susjedi',
        'Provjeravamo uređaje, prozore i toplu vodu',
        'Iskreno ćemo reći: uzeti ili tražiti dalje',
      ],
      [
        'Прийдемо, коли зручно вам і власнику',
        'Фото і коротка розповідь — текстом або голосом',
        'Сирість, шум, світло, де зберігати речі, сусіди',
        'Перевіримо техніку, вікна і гарячу воду',
        'Чесно скажемо: брати чи шукати далі',
      ],
    ),
    priceHint: text(
      'from €40 a visit',
      'от 40 € за просмотр',
      'od 40 € po razgledavanju',
      'від 40 € за огляд',
    ),
    imageUrl: '/services/razvedka-kvartiry.jpg',
    visible: true,
    sortOrder: 3,
    createdAt: published,
    updatedAt: published,
  },
  {
    id: 'svc_transfer-airport',
    slug: 'transfer-airport',
    title: text(
      'Rides to the airport and other cities',
      'Поездки в аэропорт и другие города',
      'Vožnje do zračne luke i drugih gradova',
      'Поїздки в аеропорт і в інші міста',
    ),
    shortDescription: text(
      'A ride to Split Airport (SPU), or further, to Zagreb and other cities. For longer trips we agree the details each time.',
      'Довезём до аэропорта Сплита (SPU) или дальше — в Загреб и другие города. Дальние поездки каждый раз обсуждаем отдельно.',
      'Vozimo do zračne luke Split (SPU) ili dalje, do Zagreba i drugih gradova. Duže vožnje svaki put dogovaramo posebno.',
      'Довеземо до аеропорту Спліта (SPU) або далі — до Загреба та інших міст. Далекі поїздки щоразу обговорюємо окремо.',
    ),
    included: lines(
      [
        'We pick you up in Split or nearby and drop you at the airport or at an address in town',
        'Help with the bags',
        'Send the flight number and we watch for a delay',
        'A child seat if you tell us ahead of time',
        'Further out, for example to Zagreb: we agree the price and whether we can drive that day',
      ],
      [
        'Заберём в Сплите или рядом и довезём до аэропорта или до адреса в городе',
        'Поможем с чемоданами',
        'Напишите номер рейса — посмотрим, не задерживается ли',
        'Детское кресло, если предупредите заранее',
        'Дальше, например в Загреб: цену и сможем ли выехать в этот день обсудим отдельно',
      ],
      [
        'Preuzmemo vas u Splitu ili u blizini i ostavimo na zračnoj luci ili na adresi u gradu',
        'Pomognemo s koferima',
        'Javite broj leta, pratimo ima li kašnjenja',
        'Dječja sjedalica ako javite unaprijed',
        'Dalje, na primjer do Zagreba: cijenu i možemo li taj dan voziti dogovorimo posebno',
      ],
      [
        'Заберемо у Спліті або поруч і довеземо до аеропорту чи до адреси в місті',
        'Допоможемо з валізами',
        'Напишіть номер рейсу — подивимося, чи немає затримки',
        'Дитяче крісло, якщо попередите заздалегідь',
        'Далі, наприклад до Загреба: ціну і чи зможемо виїхати цього дня обговоримо окремо',
      ],
    ),
    priceHint: text(
      'airport from €30; other cities, we agree each trip',
      'в аэропорт от 30 €; в другие города договоримся',
      'do zračne luke od 30 €; do drugih gradova dogovaramo',
      'в аеропорт від 30 €; в інші міста домовимося',
    ),
    imageUrl: '/services/transfer-airport.webp',
    visible: true,
    sortOrder: 4,
    createdAt: published,
    updatedAt: published,
  },
  {
    id: 'svc_gelievye-shary',
    slug: 'gelievye-shary',
    title: text(
      'Helium balloons for a party',
      'Шары с гелием на праздник',
      'Baloni s helijem za proslavu',
      'Кульки з гелієм на свято',
    ),
    shortDescription: text(
      'Balloons for a birthday or a small party, brought to you in Split.',
      'Шары на день рождения и на небольшой праздник. Привезём по Сплиту.',
      'Baloni za rođendan ili manju proslavu. Dovozimo ih po Splitu.',
      'Кульки на день народження і на невелике свято. Привеземо по Спліту.',
    ),
    included: lines(
      [
        'Helium balloons in the colours you choose',
        'A simple bunch or a small bouquet',
        'Delivery in Split at a time we agree',
        'Weights so they stay put indoors',
        'Tell us the age or the occasion and we’ll suggest what to get',
      ],
      [
        'Шары с гелием в цветах, которые выберете',
        'Простая связка или небольшой букет',
        'Привезём по Сплиту к оговорённому времени',
        'Грузики, чтобы не улетели по квартире',
        'Напишите, сколько лет или какой повод, — подскажем, что взять',
      ],
      [
        'Baloni s helijem u bojama koje odaberete',
        'Jednostavan svežanj ili manji buket',
        'Dostava po Splitu u dogovoreno vrijeme',
        'Utezi da ne odlete po stanu',
        'Napišite koliko godina slavi ili koja je prigoda, pa ćemo predložiti što uzeti',
      ],
      [
        'Кульки з гелієм у кольорах, які ви оберете',
        'Проста зв’язка або невеликий букет',
        'Привеземо по Спліту до домовленого часу',
        'Важки, щоб не полетіли по квартирі',
        'Напишіть, скільки років або яка нагода, — підкажемо, що взяти',
      ],
    ),
    priceHint: text('from €15', 'от 15 €', 'od 15 €', 'від 15 €'),
    imageUrl: '/services/gelievye-shary.jpg',
    visible: true,
    sortOrder: 5,
    createdAt: published,
    updatedAt: published,
  },
];
