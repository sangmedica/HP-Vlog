/* ===================== SANGMEDICA i18n (JA / EN / VI) ===================== */
/* Covers: index.html hero/about/business sections, representative.html */

(function () {
  var STORAGE_KEY = 'sangmedica-lang';

  var I18N = {
    ja: {
      'hero-title': '学びとキャリアを支える',
      'hero-lead': 'SANGMEDICA株式会社は現場で培った知見を、学びと挑戦へ。',

      'about-title': '会社概要',
      'about-statement': '医師の「学び」と「キャリア」に、新たな選択肢を。',
      'about-text': '医療を取り巻く環境が急速に変化する一方、教育機会にはいまも地域による格差が存在します。臨床研修指導医としての経験と、大学病院に属さず多様な医療現場を渡り歩いてきた自身のキャリアをもとに、医師の「学び方」と「キャリアの選択肢」の両面から成長を支え、自分らしい医師像を築くための新しい土台を提供します。',
      'about-table-name-label': '会社名',
      'about-table-name-value': 'SANGMEDICA株式会社',
      'about-table-founded-label': '設立',
      'about-table-founded-value': '2025年1月14日',
      'about-table-rep-label': '代表者',
      'about-table-rep-value': '代表取締役　喜多 真也',
      'about-table-address-label': '所在地',
      'about-table-address-value': '〒770-8073<br>徳島県徳島市八万町上福万9番地43',
      'about-table-business-label': '事業内容',
      'about-table-business-value': '医師生涯教育遠隔サポート<br>医師キャリアブランディングサポート<br>海外事業展開サポート',
      'rep-profile-heading': '代表者について',
      'rep-illust-alt': '喜多真也 似顔絵イラスト',
      'rep-profile-name': '代表取締役医師<br>喜多真也',
      'rep-profile-cta': '代表者紹介を見る',
      'value1-title': '臨床に根ざした学び方',
      'value1-text': '10年以上、臨床研修指導医として若手医師の教育に携わる中で、「何を学ぶか」だけでなく「どのように学ぶか」の重要性を実感してきました。日々の診療や当直に追われる中でも、限られた時間で効率よく知識を身につけ、実践に生かせる学習方法を届けます。',
      'value2-title': '多様なキャリアへの伴走',
      'value2-text': '大学病院に属さず、高度医療機関から地域密着型病院、過疎地域・離島医療、診療所、産業医、海外勤務医まで、多様な医療現場で臨床経験を積んできました。その経験を生かし、進路に悩む医師、特に無限の可能性を持つ若手医師一人ひとりの価値観や強みに寄り添ったキャリアプランニングを支援します。',
      'value3-title': '医師の可能性を広げる',
      'value3-text': '学ぶ場所も、働く場所も、目指す医師像も、一人ひとり異なります。SANGMEDICAは医療教育とキャリア支援を通じて、医師が自らの可能性を広げ、自分らしいキャリアを築いていくための新しい土台を提供し、医師の成長とその先にあるより良い医療の実現に貢献します。',

      'business-title': '事業紹介',
      'business-desc': '臨床現場で培った知見を、医療者の学びと医師の挑戦へ。',
      'biz1-title': '医療教育',
      'biz1-text': '多忙な臨床業務の合間でも学べるよう、オンライン講義やeラーニング教材に加え、医師同士が学び合い、悩みを共有できるオンラインコミュニティを運営しています。都市部に指導医が集中しがちな現状を踏まえ、地域を問わず質の高い学びと仲間にアクセスできる環境をつくります。また、医師の学びと臨床実践を支える医療情報プラットフォームの構築や、診療支援アプリの開発にも取り組んでいます。',
      'biz1-tag1': 'オンライン研修',
      'biz1-tag2': 'オンラインコミュニティ運営',
      'biz2-title': '医師キャリアブランディングサポート',
      'biz2-text': '面談を通じて医師としての強み・専門性を整理し、キャリアの方向性を言語化します。地域医療、産業医、海外勤務など多様な選択肢の中からご自身に合った働き方を一緒に描き、情報発信やポジショニングづくりまで伴走します。',
      'biz2-tag1': 'キャリア相談',
      'biz2-tag2': '強みの言語化',
      'biz3-title': '海外事業展開サポート',
      'biz3-text': '海外移住や現地での資格取得には、行政手続き・言語・生活基盤づくりなど、情報だけでは見えてこない数多くの壁があります。自ら海外クリニックに勤務し、その一つひとつを乗り越えてきた実体験をもとに、海外での就労・開業・事業展開を目指す医師や企業へ実践的なアドバイスと現地連携のサポートを提供します。',
      'biz3-tag1': 'ベトナム移住支援サポート',
      'biz3-tag2': 'ベトナム就労サポート',
      'business-cta': '事業に関するお問い合わせはこちら',

      'rep-back': '← 会社概要へ戻る',
      'rep-page-title': '代表者紹介',
      'rep-name-full': '喜多 真也',
      'rep-role': '代表取締役 / 医師',
      'rep-p1': '岡山大学医学部医学科を卒業後、救急総合診療科での後期研修を経て、消化器内科医として臨床経験を積みました。総合内科・救急・消化器領域を中心とした診療の中で、「本当に現場で使える知識や仕組みが不足している」という課題感を持つようになりました。臨床研修指導医として若手医師の教育に携わる一方、産業医として企業や自治体の健康管理にも従事し、医療と組織の両方の視点から課題を捉える中で、SANGMEDICA株式会社を設立しました。',
      'rep-p2': '現場を離れない臨床家として、そして産業保健を支える産業医として、理論だけでなく実践に根ざした医療教育・医療コンサルティングを提供することを大切にしています。',
      'rep-edu-heading': '学歴',
      'rep-edu-item1': '<span class="rep-timeline-date">2010年3月</span><span class="rep-timeline-text">岡山大学医学部医学科 卒業</span>',
      'rep-work-heading': '職歴',
      'rep-work-item1': '<span class="rep-timeline-date">2010年4月</span><span class="rep-timeline-text">医療法人徳洲会 宇治徳洲会病院　初期臨床研修 開始</span>',
      'rep-work-item2': '<span class="rep-timeline-date">2012年3月</span><span class="rep-timeline-text">同院　初期臨床研修 修了</span>',
      'rep-work-item3': '<span class="rep-timeline-date">2012年4月</span><span class="rep-timeline-text">同院　救急総合診療科 後期研修 開始</span>',
      'rep-work-item4': '<span class="rep-timeline-date">2015年3月</span><span class="rep-timeline-text">同院　救急総合診療科 後期研修 修了</span>',
      'rep-work-item5': '<span class="rep-timeline-date">2015年4月</span><span class="rep-timeline-text">一般社団法人平成紫川会 小倉記念病院　消化器内科 入職（消化器内科医員）</span>',
      'rep-work-item6': '<span class="rep-timeline-date">2019年3月</span><span class="rep-timeline-text">同院　消化器内科 退職</span>',
      'rep-work-item7': '<span class="rep-timeline-date">2019年4月</span><span class="rep-timeline-text">紫苑会藤井病院（名称変更後　福山南病院）入職（総合内科・救急科・消化器内科、消化器内科部長）</span>',
      'rep-work-item8': '<span class="rep-timeline-date">2025年1月</span><span class="rep-timeline-text">SANGMEDICA株式会社 設立</span>',
      'rep-work-item9': '<span class="rep-timeline-date">2025年3月</span><span class="rep-timeline-text">紫苑会福山南病院 退職</span>',
      'rep-work-item10': '<span class="rep-timeline-date">2025年4月</span><span class="rep-timeline-text">広域医療法人EMS事務局 入職（松岡救急クリニック・松岡救急クリニック分院・西海救急クリニック・植田救急クリニックにて勤務）</span>',
      'rep-work-item11': '<span class="rep-timeline-date">2026年6月</span><span class="rep-timeline-text">広域医療法人EMS事務局 退職</span>',
      'rep-work-item12': '<span class="rep-timeline-date">2026年8月</span><span class="rep-timeline-text">T・Matsuoka Medical Center 入職</span>',
      'rep-ohp-heading': '産業医としての実績',
      'rep-ohp-item1': '笠岡市役所・笠岡市民病院　嘱託産業医',
      'rep-quals-heading': '専門医資格',
      'rep-qual1': '総合内科専門医',
      'rep-qual2': '救急科専門医',
      'rep-qual3': '消化器病専門医',
      'rep-qual4': '消化器内視鏡専門医',
      'rep-qual5': '臨床研修指導医',
      'rep-qual6': '日本医師会認定産業医',
      'rep-cta-text': '医療教育・医療コンサルティングに関するご相談は、SANGMEDICA株式会社までお気軽にお問い合わせください。',
      'rep-cta-btn': 'お問い合わせはこちら'
    },

    en: {
      'hero-title': 'Supporting Learning and Careers',
      'hero-lead': 'SANGMEDICA Inc. turns real clinical experience into learning and new challenges.',

      'about-title': 'Company Overview',
      'about-statement': "New choices for physicians' learning and career paths.",
      'about-text': "While the healthcare environment is changing rapidly, regional disparities in educational opportunities still remain. Drawing on my experience as a clinical training supervisor and a career built across diverse medical settings outside university hospitals, we support physicians' growth from two angles — how they learn and the career choices available to them — and provide a new foundation for building the physician identity that is right for them.",
      'about-table-name-label': 'Company Name',
      'about-table-name-value': 'SANGMEDICA Inc.',
      'about-table-founded-label': 'Founded',
      'about-table-founded-value': 'January 14, 2025',
      'about-table-rep-label': 'Representative',
      'about-table-rep-value': 'Representative Director Shinya Kita',
      'about-table-address-label': 'Address',
      'about-table-address-value': '9-43 Kamifukuma, Hachiman-cho,<br>Tokushima City, Tokushima 770-8073, Japan',
      'about-table-business-label': 'Business',
      'about-table-business-value': "Remote support for physicians' lifelong education<br>Physician career branding support<br>Overseas business development support",
      'rep-profile-heading': 'About the Representative',
      'rep-illust-alt': 'Illustration of Dr. Shinya Kita',
      'rep-profile-name': 'Representative Director &amp; Physician<br>Shinya Kita',
      'rep-profile-cta': 'View Representative Profile',
      'value1-title': 'Learning Rooted in Clinical Practice',
      'value1-text': 'Over more than ten years as a clinical training supervisor educating young physicians, I have come to realize that how you learn matters just as much as what you learn. Even amid the demands of daily practice and night duty, we deliver learning methods that let physicians efficiently acquire knowledge in limited time and put it to practical use.',
      'value2-title': 'Walking Alongside Diverse Careers',
      'value2-text': 'Without ever belonging to a university hospital, I have built clinical experience across a wide range of settings — from advanced medical institutions to community hospitals, remote and island medicine, private clinics, occupational health, and working abroad. Drawing on that experience, we support career planning that respects the values and strengths of each physician facing career uncertainty, especially young physicians with limitless potential.',
      'value3-title': 'Expanding the Possibilities for Physicians',
      'value3-text': 'Where you learn, where you work, and the kind of physician you aim to become differ from person to person. Through medical education and career support, SANGMEDICA provides a new foundation for physicians to expand their possibilities and build careers true to themselves — contributing to physicians’ growth and, beyond that, to better healthcare.',

      'business-title': 'Our Business',
      'business-desc': 'Turning clinical insight into learning and new challenges for physicians.',
      'biz1-title': 'Medical Education',
      'biz1-text': "So physicians can keep learning even amid busy clinical work, we offer online lectures and e-learning materials alongside an online community where physicians can learn from one another and share concerns. Given that supervising physicians tend to be concentrated in urban areas, we create an environment where high-quality learning and peer connections are accessible regardless of region. We are also building medical information platforms and developing clinical support apps that support physicians' learning and practice.",
      'biz1-tag1': 'Online Training',
      'biz1-tag2': 'Online Community Management',
      'biz2-title': 'Physician Career Branding Support',
      'biz2-text': 'Through one-on-one consultations, we help physicians clarify their strengths and areas of expertise and put their career direction into words. From regional medicine and occupational health to working abroad, we work together to design a way of working that fits you, and stay alongside you through information sharing and building your professional positioning.',
      'biz2-tag1': 'Career Consultation',
      'biz2-tag2': 'Articulating Your Strengths',
      'biz3-title': 'Overseas Business Development Support',
      'biz3-text': "Moving abroad and obtaining local qualifications involve numerous obstacles — administrative procedures, language, building a life from scratch — that information alone doesn't reveal. Based on firsthand experience working at an overseas clinic and overcoming these challenges one by one, we provide practical advice and local-network support to physicians and companies aiming to work, open a practice, or expand their business overseas.",
      'biz3-tag1': 'Vietnam Relocation Support',
      'biz3-tag2': 'Vietnam Employment Support',
      'business-cta': 'Contact us about our business',

      'rep-back': '← Back to Company Overview',
      'rep-page-title': 'Representative',
      'rep-name-full': 'Shinya Kita',
      'rep-role': 'Representative Director / Physician',
      'rep-p1': 'After graduating from the Faculty of Medicine at Okayama University, I completed advanced residency training in Emergency and General Medicine before building clinical experience as a gastroenterologist. Through practice centered on general internal medicine, emergency care, and gastroenterology, I came to feel that there was a real shortage of knowledge and systems that could actually be used on the front lines. While educating young physicians as a clinical training supervisor, I also worked as an occupational health physician managing the health of employees at companies and municipalities. Viewing challenges from both a medical and an organizational perspective led me to found SANGMEDICA Inc.',
      'rep-p2': 'As a clinician who stays close to the front line, and as an occupational health physician supporting workplace health, I place great importance on offering medical education and consulting that is rooted in practice, not just theory.',
      'rep-edu-heading': 'Education',
      'rep-edu-item1': '<span class="rep-timeline-date">March 2010</span><span class="rep-timeline-text">Graduated, Faculty of Medicine, Okayama University</span>',
      'rep-work-heading': 'Career History',
      'rep-work-item1': '<span class="rep-timeline-date">April 2010</span><span class="rep-timeline-text">Began initial clinical residency at Uji Tokushukai Hospital (Tokushukai Medical Corporation)</span>',
      'rep-work-item2': '<span class="rep-timeline-date">March 2012</span><span class="rep-timeline-text">Completed initial clinical residency at the same hospital</span>',
      'rep-work-item3': '<span class="rep-timeline-date">April 2012</span><span class="rep-timeline-text">Began advanced residency in Emergency and General Medicine at the same hospital</span>',
      'rep-work-item4': '<span class="rep-timeline-date">March 2015</span><span class="rep-timeline-text">Completed advanced residency in Emergency and General Medicine at the same hospital</span>',
      'rep-work-item5': '<span class="rep-timeline-date">April 2015</span><span class="rep-timeline-text">Joined the Department of Gastroenterology at Kokura Memorial Hospital (Heisei Shisenkai) as a staff gastroenterologist</span>',
      'rep-work-item6': '<span class="rep-timeline-date">March 2019</span><span class="rep-timeline-text">Left the Department of Gastroenterology at the same hospital</span>',
      'rep-work-item7': '<span class="rep-timeline-date">April 2019</span><span class="rep-timeline-text">Joined Shion-kai Fujii Hospital (later renamed Fukuyama Minami Hospital), practicing in General Internal Medicine, Emergency Medicine, and Gastroenterology, serving as Head of the Department of Gastroenterology</span>',
      'rep-work-item8': '<span class="rep-timeline-date">January 2025</span><span class="rep-timeline-text">Founded SANGMEDICA Inc.</span>',
      'rep-work-item9': '<span class="rep-timeline-date">March 2025</span><span class="rep-timeline-text">Left Fukuyama Minami Hospital (Shion-kai)</span>',
      'rep-work-item10': '<span class="rep-timeline-date">April 2025</span><span class="rep-timeline-text">Joined the EMS Secretariat (Wide-Area Medical Corporation), working at Matsuoka Emergency Clinic, its branch clinic, Saikai Emergency Clinic, and Ueda Emergency Clinic</span>',
      'rep-work-item11': '<span class="rep-timeline-date">June 2026</span><span class="rep-timeline-text">Left the EMS Secretariat</span>',
      'rep-work-item12': '<span class="rep-timeline-date">August 2026</span><span class="rep-timeline-text">Joined T. Matsuoka Medical Center</span>',
      'rep-ohp-heading': 'Occupational Health Physician Experience',
      'rep-ohp-item1': 'Contracted Occupational Health Physician, Kasaoka City Hall and Kasaoka City Hospital',
      'rep-quals-heading': 'Board Certifications',
      'rep-qual1': 'Board-Certified General Internist',
      'rep-qual2': 'Board-Certified Emergency Physician',
      'rep-qual3': 'Board-Certified Gastroenterologist',
      'rep-qual4': 'Board-Certified Gastrointestinal Endoscopist',
      'rep-qual5': 'Certified Clinical Training Supervisor',
      'rep-qual6': 'Japan Medical Association Certified Occupational Health Physician',
      'rep-cta-text': 'For inquiries about medical education or consulting, please feel free to contact SANGMEDICA Inc.',
      'rep-cta-btn': 'Contact Us'
    },

    vi: {
      'hero-title': 'Đồng hành cùng học tập và sự nghiệp',
      'hero-lead': 'SANGMEDICA chuyển hóa kinh nghiệm thực tiễn lâm sàng thành cơ hội học tập và thử thách mới.',

      'about-title': 'Giới thiệu công ty',
      'about-statement': 'Mang đến lựa chọn mới cho việc học tập và sự nghiệp của bác sĩ.',
      'about-text': 'Trong khi môi trường y tế đang thay đổi nhanh chóng, sự chênh lệch về cơ hội đào tạo giữa các khu vực vẫn còn tồn tại. Dựa trên kinh nghiệm là bác sĩ hướng dẫn đào tạo lâm sàng và hành trình sự nghiệp trải qua nhiều cơ sở y tế đa dạng mà không thuộc bệnh viện đại học, chúng tôi hỗ trợ sự phát triển của bác sĩ trên cả hai phương diện — cách học và lựa chọn nghề nghiệp — nhằm tạo nền tảng mới để mỗi bác sĩ xây dựng hình mẫu của riêng mình.',
      'about-table-name-label': 'Tên công ty',
      'about-table-name-value': 'Công ty SANGMEDICA',
      'about-table-founded-label': 'Thành lập',
      'about-table-founded-value': 'Ngày 14 tháng 1 năm 2025',
      'about-table-rep-label': 'Người đại diện',
      'about-table-rep-value': 'Giám đốc đại diện Kita Shinya',
      'about-table-address-label': 'Địa chỉ',
      'about-table-address-value': '9-43 Kamifukuma, Hachiman-cho,<br>thành phố Tokushima, tỉnh Tokushima 770-8073, Nhật Bản',
      'about-table-business-label': 'Lĩnh vực kinh doanh',
      'about-table-business-value': 'Hỗ trợ đào tạo y khoa liên tục từ xa cho bác sĩ<br>Hỗ trợ xây dựng thương hiệu sự nghiệp cho bác sĩ<br>Hỗ trợ phát triển kinh doanh ra nước ngoài',
      'rep-profile-heading': 'Giới thiệu về người đại diện',
      'rep-illust-alt': 'Hình minh họa bác sĩ Kita Shinya',
      'rep-profile-name': 'Giám đốc đại diện kiêm bác sĩ<br>Kita Shinya',
      'rep-profile-cta': 'Xem giới thiệu người đại diện',
      'value1-title': 'Học tập bắt nguồn từ thực hành lâm sàng',
      'value1-text': 'Qua hơn mười năm làm bác sĩ hướng dẫn đào tạo lâm sàng cho các bác sĩ trẻ, tôi nhận ra rằng cách học quan trọng không kém nội dung học. Ngay cả khi bận rộn với công việc khám chữa bệnh và trực đêm hàng ngày, chúng tôi mang đến những phương pháp học tập hiệu quả trong thời gian có hạn và có thể áp dụng ngay vào thực tiễn.',
      'value2-title': 'Đồng hành cùng những con đường sự nghiệp đa dạng',
      'value2-text': 'Không thuộc về bất kỳ bệnh viện đại học nào, tôi đã tích lũy kinh nghiệm lâm sàng tại nhiều cơ sở y tế đa dạng — từ các cơ sở y tế chuyên sâu, bệnh viện gắn liền với cộng đồng, y tế vùng sâu vùng xa và hải đảo, phòng khám, y học lao động, cho đến làm việc tại nước ngoài. Dựa trên kinh nghiệm đó, chúng tôi hỗ trợ lập kế hoạch sự nghiệp phù hợp với giá trị và thế mạnh của từng bác sĩ đang trăn trở về con đường phía trước, đặc biệt là các bác sĩ trẻ với tiềm năng vô hạn.',
      'value3-title': 'Mở rộng khả năng cho bác sĩ',
      'value3-text': 'Nơi học tập, nơi làm việc, và hình mẫu bác sĩ mà mỗi người hướng tới đều khác nhau. Thông qua đào tạo y khoa và hỗ trợ sự nghiệp, SANGMEDICA cung cấp nền tảng mới để bác sĩ mở rộng khả năng của bản thân và xây dựng sự nghiệp đúng với chính mình, góp phần vào sự phát triển của bác sĩ và nền y tế tốt đẹp hơn phía trước.',

      'business-title': 'Giới thiệu lĩnh vực kinh doanh',
      'business-desc': 'Chuyển hóa kinh nghiệm lâm sàng thành cơ hội học tập và thử thách cho bác sĩ.',
      'biz1-title': 'Đào tạo y khoa',
      'biz1-text': 'Để bác sĩ có thể học tập ngay cả trong lúc bận rộn với công việc lâm sàng, chúng tôi cung cấp các bài giảng trực tuyến và tài liệu e-learning, đồng thời vận hành một cộng đồng trực tuyến nơi các bác sĩ có thể học hỏi lẫn nhau và chia sẻ những trăn trở. Trước thực trạng bác sĩ hướng dẫn thường tập trung ở khu vực thành thị, chúng tôi tạo ra môi trường giúp mọi người, dù ở bất kỳ khu vực nào, cũng có thể tiếp cận việc học chất lượng cao và kết nối với đồng nghiệp. Chúng tôi cũng đang xây dựng nền tảng thông tin y tế và phát triển ứng dụng hỗ trợ khám chữa bệnh nhằm hỗ trợ việc học tập và thực hành lâm sàng của bác sĩ.',
      'biz1-tag1': 'Đào tạo trực tuyến',
      'biz1-tag2': 'Vận hành cộng đồng trực tuyến',
      'biz2-title': 'Hỗ trợ xây dựng thương hiệu sự nghiệp cho bác sĩ',
      'biz2-text': 'Thông qua các buổi trao đổi trực tiếp, chúng tôi giúp bác sĩ hệ thống hóa thế mạnh và chuyên môn của bản thân, đồng thời diễn đạt rõ ràng định hướng sự nghiệp. Từ y tế khu vực, y học lao động cho đến làm việc ở nước ngoài, chúng tôi cùng bạn xây dựng cách làm việc phù hợp với bản thân, đồng hành đến tận khâu truyền thông và định vị bản thân.',
      'biz2-tag1': 'Tư vấn sự nghiệp',
      'biz2-tag2': 'Xác định và diễn đạt thế mạnh',
      'biz3-title': 'Hỗ trợ phát triển kinh doanh ra nước ngoài',
      'biz3-text': 'Việc di cư ra nước ngoài hay lấy chứng chỉ hành nghề tại địa phương đi kèm với vô số rào cản mà chỉ thông tin đơn thuần không thể thấy hết — thủ tục hành chính, ngôn ngữ, xây dựng nền tảng cuộc sống. Dựa trên kinh nghiệm thực tế làm việc tại phòng khám ở nước ngoài và vượt qua từng rào cản đó, chúng tôi cung cấp lời khuyên thực tiễn và hỗ trợ kết nối tại địa phương cho các bác sĩ và doanh nghiệp mong muốn làm việc, mở phòng khám hoặc mở rộng kinh doanh ở nước ngoài.',
      'biz3-tag1': 'Hỗ trợ định cư tại Việt Nam',
      'biz3-tag2': 'Hỗ trợ làm việc tại Việt Nam',
      'business-cta': 'Liên hệ về lĩnh vực kinh doanh',

      'rep-back': '← Quay lại Giới thiệu công ty',
      'rep-page-title': 'Giới thiệu người đại diện',
      'rep-name-full': 'Kita Shinya',
      'rep-role': 'Giám đốc đại diện / Bác sĩ',
      'rep-p1': 'Sau khi tốt nghiệp Khoa Y, Đại học Okayama, tôi đã hoàn thành chương trình đào tạo chuyên sâu về cấp cứu và nội khoa tổng quát, sau đó tích lũy kinh nghiệm lâm sàng với vai trò bác sĩ nội tiêu hóa. Trong quá trình khám chữa bệnh tập trung vào nội khoa tổng quát, cấp cứu và tiêu hóa, tôi dần nhận ra vấn đề: thực sự còn thiếu những kiến thức và cơ chế có thể áp dụng ngay tại hiện trường. Trong khi tham gia đào tạo các bác sĩ trẻ với vai trò bác sĩ hướng dẫn đào tạo lâm sàng, tôi cũng đảm nhận vai trò bác sĩ y học lao động, phụ trách quản lý sức khỏe cho doanh nghiệp và chính quyền địa phương. Từ việc nhìn nhận vấn đề trên cả hai góc độ y tế và tổ chức, tôi đã thành lập Công ty SANGMEDICA.',
      'rep-p2': 'Là một bác sĩ lâm sàng luôn gắn bó với hiện trường, và là bác sĩ y học lao động hỗ trợ sức khỏe nghề nghiệp, tôi luôn coi trọng việc cung cấp dịch vụ đào tạo y khoa và tư vấn y tế bắt nguồn từ thực tiễn chứ không chỉ lý thuyết.',
      'rep-edu-heading': 'Học vấn',
      'rep-edu-item1': '<span class="rep-timeline-date">Tháng 3/2010</span><span class="rep-timeline-text">Tốt nghiệp Khoa Y, Đại học Okayama</span>',
      'rep-work-heading': 'Quá trình công tác',
      'rep-work-item1': '<span class="rep-timeline-date">Tháng 4/2010</span><span class="rep-timeline-text">Bắt đầu chương trình thực tập lâm sàng ban đầu tại Bệnh viện Uji Tokushukai (Tập đoàn Y tế Tokushukai)</span>',
      'rep-work-item2': '<span class="rep-timeline-date">Tháng 3/2012</span><span class="rep-timeline-text">Hoàn thành chương trình thực tập lâm sàng ban đầu tại bệnh viện trên</span>',
      'rep-work-item3': '<span class="rep-timeline-date">Tháng 4/2012</span><span class="rep-timeline-text">Bắt đầu chương trình đào tạo chuyên sâu Khoa Cấp cứu - Nội khoa tổng quát tại bệnh viện trên</span>',
      'rep-work-item4': '<span class="rep-timeline-date">Tháng 3/2015</span><span class="rep-timeline-text">Hoàn thành chương trình đào tạo chuyên sâu Khoa Cấp cứu - Nội khoa tổng quát tại bệnh viện trên</span>',
      'rep-work-item5': '<span class="rep-timeline-date">Tháng 4/2015</span><span class="rep-timeline-text">Gia nhập Khoa Tiêu hóa, Bệnh viện Kokura Memorial (Hiệp hội Heisei Shisenkai) với vai trò bác sĩ nội tiêu hóa</span>',
      'rep-work-item6': '<span class="rep-timeline-date">Tháng 3/2019</span><span class="rep-timeline-text">Rời Khoa Tiêu hóa của bệnh viện trên</span>',
      'rep-work-item7': '<span class="rep-timeline-date">Tháng 4/2019</span><span class="rep-timeline-text">Gia nhập Bệnh viện Fujii thuộc Shion-kai (sau đổi tên thành Bệnh viện Fukuyama Minami), phụ trách Nội khoa tổng quát, Cấp cứu và Tiêu hóa, giữ chức Trưởng khoa Tiêu hóa</span>',
      'rep-work-item8': '<span class="rep-timeline-date">Tháng 1/2025</span><span class="rep-timeline-text">Thành lập Công ty SANGMEDICA</span>',
      'rep-work-item9': '<span class="rep-timeline-date">Tháng 3/2025</span><span class="rep-timeline-text">Rời Bệnh viện Fukuyama Minami (Shion-kai)</span>',
      'rep-work-item10': '<span class="rep-timeline-date">Tháng 4/2025</span><span class="rep-timeline-text">Gia nhập Văn phòng EMS (Tập đoàn Y tế diện rộng), làm việc tại Phòng khám Cấp cứu Matsuoka, chi nhánh, Phòng khám Cấp cứu Saikai và Phòng khám Cấp cứu Ueda</span>',
      'rep-work-item11': '<span class="rep-timeline-date">Tháng 6/2026</span><span class="rep-timeline-text">Rời Văn phòng EMS</span>',
      'rep-work-item12': '<span class="rep-timeline-date">Tháng 8/2026</span><span class="rep-timeline-text">Gia nhập T. Matsuoka Medical Center</span>',
      'rep-ohp-heading': 'Kinh nghiệm với vai trò bác sĩ y học lao động',
      'rep-ohp-item1': 'Bác sĩ y học lao động hợp đồng tại Tòa thị chính thành phố Kasaoka và Bệnh viện Thành phố Kasaoka',
      'rep-quals-heading': 'Chứng chỉ chuyên khoa',
      'rep-qual1': 'Bác sĩ chuyên khoa Nội tổng quát',
      'rep-qual2': 'Bác sĩ chuyên khoa Cấp cứu',
      'rep-qual3': 'Bác sĩ chuyên khoa Tiêu hóa (Nội khoa)',
      'rep-qual4': 'Bác sĩ chuyên khoa Nội soi tiêu hóa',
      'rep-qual5': 'Bác sĩ hướng dẫn đào tạo lâm sàng được chứng nhận',
      'rep-qual6': 'Bác sĩ y học lao động được Hiệp hội Y khoa Nhật Bản chứng nhận',
      'rep-cta-text': 'Nếu có bất kỳ thắc mắc nào về đào tạo y khoa hoặc tư vấn y tế, xin vui lòng liên hệ với Công ty SANGMEDICA.',
      'rep-cta-btn': 'Liên hệ ngay'
    }
  };

  var HTML_LANG = { ja: 'ja', en: 'en', vi: 'vi' };

  function applyLanguage(lang) {
    var dict = I18N[lang] || I18N.ja;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-alt');
      if (dict[key] != null) el.setAttribute('alt', dict[key]);
    });

    document.documentElement.setAttribute('lang', HTML_LANG[lang] || 'ja');

    document.querySelectorAll('.lang-switch button[data-lang]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-lang') === lang);
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    var saved = 'ja';
    try { saved = localStorage.getItem(STORAGE_KEY) || 'ja'; } catch (e) {}
    if (!I18N[saved]) saved = 'ja';
    applyLanguage(saved);

    document.querySelectorAll('.lang-switch button[data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLanguage(btn.getAttribute('data-lang'));
      });
    });
  });
})();
