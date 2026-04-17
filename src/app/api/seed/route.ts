import { NextResponse } from "next/server";
import { initDb, getDb } from "@/lib/db";
import { isAuthenticated } from "@/lib/admin-auth";

export async function POST() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initDb();
    const sql = getDb();

    // Check if data already exists
    const existingTestimonials = await sql`SELECT COUNT(*) as count FROM testimonials`;
    const existingServices = await sql`SELECT COUNT(*) as count FROM services`;
    const existingPlans = await sql`SELECT COUNT(*) as count FROM plans`;

    const results: string[] = [];

    // ===== SEED TESTIMONIALS =====
    if (Number(existingTestimonials[0].count) === 0) {
      const testimonials = [
        { nameEn: "Hani Kamel", nameAr: "هاني كامل", roleEn: "Ex TikTok Manager", roleAr: "مدير تيك توك سابق", contentEn: "Excellent experience with Brand Lab. Highly professional team with a deep understanding of Reels and TikTok strategies that truly elevated my content quality.", contentAr: "تجربة ممتازة مع براند لاب. فريق احترافي جداً وفاهم استراتيجيات الريلز والتيك توك، وده رفع جودة المحتوى بتاعي بشكل كبير.", rating: 5 },
        { nameEn: "Sara", nameAr: "سارة", roleEn: "Founder, Alpha Brand Cosmetics", roleAr: "مؤسسة، ألفا براند كوزمتكس", contentEn: "Brand Lab turned the exact ideas in my head into videos. Professional editing, on-time delivery, and honestly faster than expected. So happy working with them!", contentAr: "براند لاب طلّعوا الفكرة اللي في دماغي فيديو بالظبط. مونتاج بروفيشنال وتسليم في المعاد وأسرع كمان. مبسوطة جداً بالشغل معاهم!", rating: 5 },
        { nameEn: "Mo Adel", nameAr: "مو عادل", roleEn: "Sales Specialist, Lucky Wheels", roleAr: "أخصائي مبيعات، لاكي ويلز", contentEn: "I really loved working with you. Friendly team, high quality videos and editing. Thanks for providing such high quality services at competitive prices.", contentAr: "حبيت جداً الشغل معاكم. فريق ودود وجودة فيديوهات ومونتاج عالية. شكراً لتقديم خدمات بجودة عالية وأسعار تنافسية.", rating: 5 },
        { nameEn: "Karim Gabriel", nameAr: "كريم جبريال", roleEn: "Founder, Keep Going & KG", roleAr: "مؤسس، كيب جوينج و KG", contentEn: "Working with Brand Lab has been a professional experience. Projects delivered on time, editing requests handled quickly — all within a well-priced package.", contentAr: "التعامل مع براند لاب كان تجربة احترافية. المشاريع تُسلّم في موعدها وطلبات التعديل بتتنفذ بسرعة — وكل ده بسعر ممتاز.", rating: 5 },
        { nameEn: "Ahmed Maged", nameAr: "أحمد ماجد", roleEn: "Owner, Redbone Gym & CM Transformation", roleAr: "مالك، ريدبون جيم و CM Transformation", contentEn: "My content was inconsistent before, but now everything is different. Communication is easy, delivery is fast, and my sales and social media presence have grown significantly.", contentAr: "المحتوى كان غير منتظم قبل كده، بس دلوقتي كل حاجة اتغيرت. التعامل سهل والتسليم سريع والمبيعات والانتشار على السوشيال ميديا زادوا جداً.", rating: 5 },
      ];

      for (const t of testimonials) {
        await sql`INSERT INTO testimonials (name_en, name_ar, role_en, role_ar, content_en, content_ar, rating) VALUES (${t.nameEn}, ${t.nameAr}, ${t.roleEn}, ${t.roleAr}, ${t.contentEn}, ${t.contentAr}, ${t.rating})`;
      }
      results.push(`Seeded ${testimonials.length} testimonials`);
    } else {
      results.push(`Testimonials already exist (${existingTestimonials[0].count}), skipped`);
    }

    // ===== SEED SERVICES =====
    if (Number(existingServices[0].count) === 0) {
      const services = [
        {
          titleEn: "Video Editing", titleAr: "تحرير الفيديو",
          descriptionEn: "Professional editing that transforms raw footage into polished, engaging content ready to captivate your audience.",
          descriptionAr: "تحرير احترافي يحوّل اللقطات الخام إلى محتوى مصقول وجذاب يأسر جمهورك.",
          detailedEn: "Our video editing service covers the full post-production pipeline. From assembly cuts to final delivery, we handle multi-cam editing, narrative structuring, pacing optimization, and seamless transitions. Whether you need a YouTube video, a corporate presentation, or a social media campaign, we ensure every frame serves your story. We work with all major formats and deliver in any resolution up to 4K.",
          detailedAr: "تغطي خدمة تحرير الفيديو لدينا خط إنتاج ما بعد التصوير بالكامل. من القص الأولي إلى التسليم النهائي، نتولى التحرير متعدد الكاميرات، وبناء السرد، وتحسين الإيقاع، والانتقالات السلسة. سواء كنت بحاجة إلى فيديو يوتيوب أو عرض مؤسسي أو حملة سوشيال ميديا، نضمن أن كل إطار يخدم قصتك. نعمل مع جميع الصيغ الرئيسية ونسلم بأي دقة حتى 4K.",
          icon: "Film", sortOrder: 0,
        },
        {
          titleEn: "Montage & Reels", titleAr: "المونتاج والريلز",
          descriptionEn: "Dynamic montages and short-form reels optimized for social media platforms to maximize reach and engagement.",
          descriptionAr: "مونتاج ديناميكي وريلز قصيرة محسّنة لمنصات التواصل الاجتماعي لتحقيق أقصى انتشار وتفاعل.",
          detailedEn: "Short-form content is king, and we know how to make it reign. We create scroll-stopping reels and montages for Instagram, TikTok, YouTube Shorts, and more. Each piece is crafted with platform-specific best practices — optimal aspect ratios, hook-driven openings, trending audio integration, and text overlays that boost engagement and shareability.",
          detailedAr: "المحتوى القصير هو الملك، ونحن نعرف كيف نجعله يتصدر. نصنع ريلز ومونتاج يوقف التمرير لإنستغرام وتيك توك ويوتيوب شورتس والمزيد. كل قطعة مصممة وفق أفضل ممارسات كل منصة — نسب العرض المثالية، والمقدمات الجاذبة، ودمج الأصوات الرائجة، والنصوص المتراكبة التي تعزز التفاعل والمشاركة.",
          icon: "Scissors", sortOrder: 1,
        },
        {
          titleEn: "Content Creation", titleAr: "صناعة المحتوى",
          descriptionEn: "We help you craft compelling ideas, scripts, and content strategies — even if you don't know where to start.",
          descriptionAr: "نساعدك في ابتكار الأفكار وكتابة السكريبتات وتطوير استراتيجية المحتوى — حتى لو ما عندك أي فكرة من وين تبدأ.",
          detailedEn: "Great content starts with a great idea. Our content creation team works with you from the ground up — brainstorming concepts, writing scripts, developing hooks, and planning your content calendar. Whether you're a brand that knows what you want or someone who has no idea where to begin, we guide you through every step. We handle ideation, scriptwriting, storyboarding, and creative direction so you can focus on your business while we bring your vision to life.",
          detailedAr: "المحتوى المميز يبدأ بفكرة مميزة. فريق صناعة المحتوى لدينا يشتغل معاك من الصفر — من العصف الذهني للأفكار، وكتابة السكريبتات، وتطوير الهوكات، وتخطيط جدول المحتوى. سواء كنت براند عارف وش يبي أو شخص ما يدري من وين يبدأ، نوجهك في كل خطوة. نتولى الأفكار والكتابة والتوجيه الإبداعي عشان تركز على شغلك وإحنا نحوّل رؤيتك لواقع.",
          icon: "Lightbulb", sortOrder: 2,
        },
        {
          titleEn: "Motion Graphics", titleAr: "الرسوم المتحركة",
          descriptionEn: "Eye-catching animations, lower thirds, intros, and transitions that elevate your brand's visual identity.",
          descriptionAr: "رسوم متحركة لافتة، عناوين سفلية، مقدمات وانتقالات ترتقي بهوية علامتك البصرية.",
          detailedEn: "Bring your brand to life with custom motion graphics. We design animated logos, kinetic typography, data visualizations, explainer animations, lower thirds, end screens, and transition effects. Every animation is crafted to match your brand guidelines and add a professional polish that sets your content apart from the competition.",
          detailedAr: "أحيِ علامتك التجارية برسوم متحركة مخصصة. نصمم شعارات متحركة، وتيبوغرافيا حركية، وتصورات بيانات، ورسوم توضيحية، وعناوين سفلية، وشاشات نهاية، ومؤثرات انتقالية. كل حركة مصممة لتتوافق مع إرشادات علامتك وتضيف لمسة احترافية تميز محتواك عن المنافسين.",
          icon: "Monitor", sortOrder: 3,
        },
        {
          titleEn: "Sound Design", titleAr: "تصميم الصوت",
          descriptionEn: "Professional audio mixing, sound effects, and music selection that bring your visuals to life.",
          descriptionAr: "مزج صوتي احترافي ومؤثرات صوتية واختيار موسيقى تبث الحياة في مرئياتك.",
          detailedEn: "Great video is only half the experience — sound completes it. Our sound design service includes professional audio mixing, noise reduction, dialogue enhancement, foley effects, ambient soundscapes, and royalty-free music curation. We ensure your audio is broadcast-ready with balanced levels and crystal-clear quality across all playback devices.",
          detailedAr: "الفيديو الرائع هو نصف التجربة فقط — الصوت يكملها. تشمل خدمة تصميم الصوت لدينا المزج الصوتي الاحترافي، وتقليل الضوضاء، وتحسين الحوار، ومؤثرات فولي، والمشاهد الصوتية المحيطية، واختيار الموسيقى بدون حقوق ملكية. نضمن أن صوتك جاهز للبث بمستويات متوازنة وجودة صافية عبر جميع أجهزة التشغيل.",
          icon: "Music", sortOrder: 4,
        },
        {
          titleEn: "Brand Identity Videos", titleAr: "فيديوهات الهوية",
          descriptionEn: "Crafted brand films and promotional videos that communicate your story and values with impact.",
          descriptionAr: "أفلام ترويجية وفيديوهات علامة تجارية مصممة لتوصيل قصتك وقيمك بتأثير.",
          detailedEn: "Your brand deserves more than a logo — it deserves a story. We produce cinematic brand films, company culture videos, product showcases, and mission-driven content that connects with your audience on an emotional level. From scripting and storyboarding to final delivery, we handle every aspect of production to ensure your brand's essence is captured authentically.",
          detailedAr: "علامتك التجارية تستحق أكثر من شعار — تستحق قصة. ننتج أفلام علامات تجارية سينمائية، وفيديوهات ثقافة الشركة، وعروض المنتجات، ومحتوى مدفوع بالرسالة يتواصل مع جمهورك على المستوى العاطفي. من كتابة السيناريو والقصة المصورة إلى التسليم النهائي، نتولى كل جانب من جوانب الإنتاج لضمان التقاط جوهر علامتك بأصالة.",
          icon: "Sparkles", sortOrder: 5,
        },
      ];

      for (const s of services) {
        await sql`INSERT INTO services (title_en, title_ar, description_en, description_ar, detailed_en, detailed_ar, icon, sort_order)
          VALUES (${s.titleEn}, ${s.titleAr}, ${s.descriptionEn}, ${s.descriptionAr}, ${s.detailedEn}, ${s.detailedAr}, ${s.icon}, ${s.sortOrder})`;
      }
      results.push(`Seeded ${services.length} services`);
    } else {
      results.push(`Services already exist (${existingServices[0].count}), skipped`);
    }

    // ===== SEED PLANS =====
    if (Number(existingPlans[0].count) === 0) {
      const plans = [
        {
          nameEn: "Basic", nameAr: "الأساسي", slug: "basic",
          descriptionEn: "For brands starting to post consistently",
          descriptionAr: "للعلامات التجارية التي تبدأ بالنشر بانتظام",
          priceEg: "4,000 EGP", priceInt: "$124", priceRawEg: 4000, priceRawInt: 124,
          period: "month",
          featuresEn: "5 reels/month\nHook writing included\nClean, engaging edits\nBasic captions",
          featuresAr: "5 ريلز/شهر\nكتابة هوك مضمّنة\nمونتاج نظيف وجذاب\nكابشن أساسي",
          isFeatured: false, sortOrder: 0,
        },
        {
          nameEn: "Pro", nameAr: "الاحترافي", slug: "pro",
          descriptionEn: "For brands ready to grow and scale content",
          descriptionAr: "للعلامات التجارية المستعدة للنمو وتوسيع المحتوى",
          priceEg: "6,000 EGP", priceInt: "$199", priceRawEg: 6000, priceRawInt: 199,
          period: "month",
          featuresEn: "10 reels/month\nAdvanced hook writing\nRetention-focused editing\nTrend-based editing styles\nCaptions included",
          featuresAr: "10 ريلز/شهر\nكتابة هوك متقدمة\nمونتاج يركّز على الاحتفاظ\nأساليب مونتاج قائمة على الترندات\nكابشن مضمّن",
          isFeatured: false, sortOrder: 1,
        },
        {
          nameEn: "Business", nameAr: "الأعمال", slug: "business",
          descriptionEn: "For brands that want daily presence and maximum reach",
          descriptionAr: "للعلامات التجارية التي تريد حضوراً يومياً وأقصى انتشار",
          priceEg: "10,000 EGP", priceInt: "$299", priceRawEg: 10000, priceRawInt: 299,
          period: "month",
          featuresEn: "20 reels/month\nFull content strategy\nTrend research\nRetention optimization\nDedicated editor\nMonthly growth guidance",
          featuresAr: "20 ريلز/شهر\nاستراتيجية محتوى كاملة\nبحث عن الترندات\nتحسين الاحتفاظ بالمشاهدين\nمحرر مخصص\nتوجيه نمو شهري",
          isFeatured: true, sortOrder: 2,
        },
      ];

      for (const p of plans) {
        await sql`INSERT INTO plans (name_en, name_ar, slug, description_en, description_ar, price_eg, price_int, price_raw_eg, price_raw_int, period, features_en, features_ar, is_featured, sort_order)
          VALUES (${p.nameEn}, ${p.nameAr}, ${p.slug}, ${p.descriptionEn}, ${p.descriptionAr}, ${p.priceEg}, ${p.priceInt}, ${p.priceRawEg}, ${p.priceRawInt}, ${p.period}, ${p.featuresEn}, ${p.featuresAr}, ${p.isFeatured}, ${p.sortOrder})`;
      }
      results.push(`Seeded ${plans.length} plans`);
    } else {
      results.push(`Plans already exist (${existingPlans[0].count}), skipped`);
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
