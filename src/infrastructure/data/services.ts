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
      'Чоловік на годину',
    ),
    shortDescription: text(
      'Small repairs and odd jobs around your home in Split — we come ourselves.',
      'Мелкий ремонт и бытовые задачи по Сплиту — приезжаем сами.',
      'Sitni popravci i kućanski poslovi u Splitu — dolazimo osobno.',
      'Дрібний ремонт і побутові завдання у Спліті — приїжджаємо самі.',
    ),
    included: lines(
      [
        'We mount shelves, TVs, curtains, and mirrors',
        'We replace taps, locks, and light fittings',
        'Small fixes: doors, furniture, silicone, drips',
        'An extra pair of hands for something heavy',
        'We agree the scope on site before we start',
      ],
      [
        'Повесим полки, телевизор, карнизы и зеркала',
        'Заменим смеситель, замок или светильник',
        'Мелкий ремонт: двери, мебель, герметик, протечки',
        'Поможем с тем, что одному не поднять',
        'Объём работ согласуем на месте до старта',
      ],
      [
        'Montiramo police, televizore, zavjese i ogledala',
        'Mijenjamo slavine, brave i rasvjetna tijela',
        'Sitni popravci: vrata, namještaj, silikon, curenje',
        'Pomoć kad nešto treba podići u dvoje',
        'Opseg dogovaramo na licu mjesta prije početka',
      ],
      [
        'Повісимо полиці, телевізор, карнизи й дзеркала',
        'Замінимо змішувач, замок або світильник',
        'Дрібний ремонт: двері, меблі, герметик, протікання',
        'Допоможемо з тим, що одному не підняти',
        'Обсяг робіт узгодимо на місці до старту',
      ],
    ),
    priceHint: text(
      'from €25 / hour',
      'от 25 € / час',
      'od 25 € / sat',
      'від 25 € / год',
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
      'Изготовление и сборка мебели',
      'Izrada i sastavljanje namještaja',
      'Виготовлення та складання меблів',
    ),
    shortDescription: text(
      'We measure, design, and build furniture for your flat — or assemble a piece you already bought, including IKEA.',
      'Снимем размеры, сделаем проект и изготовим мебель под квартиру — или соберём то, что вы уже купили, в том числе IKEA.',
      'Uzimamo mjere, radimo projekt i izrađujemo namještaj za stan — ili sastavljamo komad koji ste već kupili, uključujući IKEA.',
      'Знімемо розміри, зробимо проєкт і виготовимо меблі під квартиру — або зберемо те, що ви вже купили, зокрема IKEA.',
    ),
    included: lines(
      [
        'We come, measure the space, and agree what you need',
        'A project image or a simple prototype before we build',
        'We make the piece, bring it to the flat, and install it',
        'Or we assemble furniture you already bought, including IKEA',
        'Doors, drawers, and hinges adjusted on site',
      ],
      [
        'Приедем, снимем размеры и согласуем, что нужно',
        'Покажем проект — картинку или простой прототип — до изготовления',
        'Изготовим, привезём в квартиру и установим',
        'Или соберём мебель, которую вы уже купили, в том числе IKEA',
        'На месте отрегулируем двери, ящики и петли',
      ],
      [
        'Dolazimo, uzimamo mjere i dogovaramo što treba',
        'Prije izrade pokazujemo projekt: sliku ili jednostavan prototip',
        'Izrađujemo, dovozimo u stan i montiramo',
        'Ili sastavljamo namještaj koji ste već kupili, uključujući IKEA',
        'Na licu mjesta podešavamo vrata, ladice i šarke',
      ],
      [
        'Приїдемо, знімемо розміри і узгодимо, що потрібно',
        'Покажемо проєкт — зображення або простий прототип — до виготовлення',
        'Виготовимо, привеземо в квартиру і встановимо',
        'Або зберемо меблі, які ви вже купили, зокрема IKEA',
        'На місці відрегулюємо двері, шухляди і петлі',
      ],
    ),
    priceHint: text(
      'quote after a photo or a quick look',
      'цена после фото или короткого осмотра',
      'cijena nakon fotografije ili kratkog pregleda',
      'ціна після фото або короткого огляду',
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
      'Apartment inspection before renting',
      'Разведка квартиры перед арендой',
      'Provjera stana prije najma',
      'Перевірка квартири перед орендою',
    ),
    shortDescription: text(
      'We visit the flat for you and report what the photos don’t show.',
      'Сходим на просмотр за вас и расскажем то, чего нет на фото.',
      'Odemo na pregled umjesto vas i javimo što se ne vidi na fotografijama.',
      'Сходимо на огляд замість вас і розповімо те, чого немає на фото.',
    ),
    included: lines(
      [
        'A visit at the time you agree with the landlord',
        'Photos and a short text or voice report',
        'Notes on damp, noise, light, storage, and neighbours',
        'A check of appliances, windows, and hot water',
        'Honest advice: take it, or keep looking',
      ],
      [
        'Визит в удобное вам и хозяину время',
        'Фото и короткий отчёт текстом или голосом',
        'Сырость, шум, свет, хранение, соседи',
        'Проверка техники, окон и горячей воды',
        'Честный совет: брать или искать дальше',
      ],
      [
        'Posjet u terminu koji dogovorite s najmodavcem',
        'Fotografije i kratko izvješće, tekstom ili glasovno',
        'Vlaga, buka, svjetlo, spremište, susjedi',
        'Provjera uređaja, prozora i tople vode',
        'Iskren savjet: uzeti ili tražiti dalje',
      ],
      [
        'Візит у зручний для вас і власника час',
        'Фото і короткий звіт текстом або голосом',
        'Вологість, шум, світло, зберігання, сусіди',
        'Перевірка техніки, вікон і гарячої води',
        'Чесна порада: брати чи шукати далі',
      ],
    ),
    priceHint: text(
      'from €40 per visit',
      'от 40 € за визит',
      'od 40 € po posjetu',
      'від 40 € за візит',
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
      'Transfer to the airport and nearby cities',
      'Трансфер в аэропорт и ближайшие города',
      'Transfer do zračne luke i obližnjih gradova',
      'Трансфер до аеропорту та найближчих міст',
    ),
    shortDescription: text(
      'A ride to Split airport (SPU), or further — to Zagreb and other cities. Longer trips are agreed one by one.',
      'Поездка в аэропорт Сплита (SPU) или дальше — в Загреб и другие города. Дальние маршруты обсуждаем отдельно.',
      'Vožnja do zračne luke Split (SPU) ili dalje — do Zagreba i drugih gradova. Duže rute dogovaramo posebno.',
      'Поїздка в аеропорт Спліта (SPU) або далі — до Загреба та інших міст. Далекі маршрути обговорюємо окремо.',
    ),
    included: lines(
      [
        'Pickup in Split or nearby, drop-off at the airport or in town',
        'Help with suitcases',
        'Your flight number, so we can track a delay',
        'A child seat if you ask ahead',
        'Further trips, for example to Zagreb: the price and whether we can drive that day are agreed individually',
      ],
      [
        'Заберём в Сплите или рядом, высадим в аэропорту или в городе',
        'Поможем с чемоданами',
        'Номер рейса — следим за задержкой',
        'Детское кресло, если сказать заранее',
        'Поездки дальше, например в Загреб: цену и сможем ли поехать в этот день обсуждаем отдельно',
      ],
      [
        'Preuzimanje u Splitu ili blizini, iskrcaj na zračnoj luci ili u gradu',
        'Pomoć s koferima',
        'Broj leta — pratimo kašnjenje',
        'Dječja sjedalica ako javite unaprijed',
        'Duže vožnje, na primjer do Zagreba: cijenu i možemo li taj dan voziti dogovaramo pojedinačno',
      ],
      [
        'Заберемо у Спліті або поруч, висадимо в аеропорту або в місті',
        'Допоможемо з валізами',
        'Номер рейсу — стежимо за затримкою',
        'Дитяче крісло, якщо сказати заздалегідь',
        'Поїздки далі, наприклад до Загреба: ціну і чи зможемо поїхати цього дня обговорюємо окремо',
      ],
    ),
    priceHint: text(
      'airport from €30; other cities quoted individually',
      'аэропорт от 30 €; другие города — по договорённости',
      'zračna luka od 30 €; drugi gradovi po dogovoru',
      'аеропорт від 30 €; інші міста — за домовленістю',
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
      'Helium balloons for parties',
      'Гелиевые шары для праздников',
      'Helijevi baloni za proslave',
      'Гелієві кульки для свят',
    ),
    shortDescription: text(
      'Balloons for birthdays and small celebrations, delivered in Split.',
      'Шары на день рождения и небольшой праздник, с доставкой по Сплиту.',
      'Baloni za rođendane i manje proslave, s dostavom po Splitu.',
      'Кульки на день народження і невелике свято, з доставкою по Спліту.',
    ),
    included: lines(
      [
        'Helium balloons in the colours you choose',
        'A simple bunch or a small arrangement',
        'Delivery in Split at an agreed time',
        'Weights so they don’t escape indoors',
        'Tell us the age or the occasion and we’ll suggest a set',
      ],
      [
        'Гелиевые шары в выбранных цветах',
        'Простой букет или небольшая композиция',
        'Доставка по Сплиту к договорённому времени',
        'Грузики, чтобы не улетели в квартире',
        'Напишите возраст или повод — предложим набор',
      ],
      [
        'Helijevi baloni u bojama koje odaberete',
        'Jednostavan buket ili manji aranžman',
        'Dostava po Splitu u dogovoreno vrijeme',
        'Utezi da ne odlete u stanu',
        'Napišite dob ili povod — predložit ćemo set',
      ],
      [
        'Гелієві кульки в обраних кольорах',
        'Простий букет або невелика композиція',
        'Доставка по Спліту до домовленого часу',
        'Важки, щоб не полетіли в квартирі',
        'Напишіть вік або привід — запропонуємо набір',
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
