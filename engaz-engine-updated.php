
/**
* Plugin Name: Engaz Care Booking System & SaaS (Pro Version 2.4)
* Description: Payment Gateway Integration, Full CRM, Slot Manager, Multilingual Refinements & Pro UI.
* Version: 2.4
* Author: Engaz Care
*/

if (!defined('ABSPATH')) exit; // Security check

/* ============================================================================
* 1. ADMIN ASSETS (MEDIA UPLOADER)
* ============================================================================ */
add_action('admin_enqueue_scripts', 'ecb_enqueue_admin_assets');
function ecb_enqueue_admin_assets($hook) {
    if ($hook == 'toplevel_page_ecb-saas-dash') { wp_enqueue_media(); }
}

/* ============================================================================
* 2. FRONTEND APP UI
* ============================================================================ */
add_shortcode('custom_service_booking', 'ecb_render_booking_app');
function ecb_render_booking_app() {
    ob_start();
    $args = array('post_type' => 'product', 'posts_per_page' => -1, 'tax_query' => array(array('taxonomy' => 'product_cat', 'field' => 'slug', 'terms' => 'booking-services')));
    $services = get_posts($args);
    $nonce = wp_create_nonce('ecb_booking_secure_nonce');
    ?>

    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

    <style>
        :root {
            --bg-main: #041a24;
            --bg-secondary: #072736;
            --primary: #12b3b6;
            --primary-glow: rgba(18, 179, 182, 0.4);
            --card-bg: rgba(255, 255, 255, 0.03);
            --card-border: rgba(255, 255, 255, 0.08);
            --text-light: #ffffff;
            --text-gray: #a3b8c2;
            --radius-lg: 24px;
            --radius-md: 16px;
            --radius-sm: 10px;
            --border-color: rgba(255, 255, 255, 0.08);
            --border-white: rgba(255, 255, 255, 0.08);
            --text-placeholder: #a3b8c2;
        }

        .ecb-wrap {
            width: 100%; max-width: 100%; margin: 0 auto;
            font-family: 'Tajawal', sans-serif !important;
            background: rgba(7, 39, 54, 0.7);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid var(--card-border);
            border-radius: var(--radius-lg);
            padding: 40px;
            color: var(--text-light); direction: rtl; text-align: right; box-sizing: border-box;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            position: relative;
        }

        @media (max-width: 768px) {
            .ecb-wrap { padding: 25px 15px; border-radius: 16px; }
            .ecb-step-title { font-size: 20px; }
            .ecb-input { padding: 14px 15px; }
        }

        .ecb-wrap * { box-sizing: border-box; }
        .ecb-wrap input, .ecb-wrap select, .ecb-wrap button, .ecb-wrap textarea { font-family: 'Tajawal', sans-serif !important; }
        .ecb-header { padding: 0 0 30px; border-bottom: 1px solid var(--border-color); margin-bottom: 30px;}
        .ecb-progress { display: flex; gap: 10px; justify-content: center; max-width: 100%; }
        .ecb-prog-step { flex: 1; height: 5px; background: rgba(255,255,255,0.1); border-radius: 10px; transition: 0.4s; }
        .ecb-prog-step.active { background: var(--primary); box-shadow: 0 0 12px rgba(18,179,182,0.6); }
        .ecb-step { display: none; animation: ecbFadeIn 0.3s ease forwards; padding: 10px 0; }
        .ecb-step.active { display: block; }
        @keyframes ecbFadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

        .ecb-step-title { font-weight: 800; font-size: 24px; margin-top: 20px; margin-bottom: 30px; color: #ffffff; display: flex; align-items: center; gap: 10px; justify-content: center; }
        .ecb-form-row { margin-bottom: 25px; position: relative;}
        .ecb-label { display: block; font-size: 16px; font-weight: 600; color: #ffffff; margin-bottom: 10px; }

        .ecb-input { width: 100%; padding: 18px 20px; border: 1px solid var(--card-border); border-radius: var(--radius-sm); background: rgba(7, 39, 54, 0.7) !important; color: var(--text-light) !important; font-size: 16px; transition: 0.3s; }
        .ecb-input:focus { outline: none; border-color: var(--primary); background: rgba(4, 26, 36, 0.9) !important; box-shadow: 0 0 15px var(--primary-glow) inset; }
        .ecb-input::placeholder { color: var(--text-placeholder) !important; opacity: 1; }
        .ecb-input option { color: var(--text-light); background: var(--bg-secondary); }

        /* =====================================================================
           SELECT2 ULTIMATE FIX
           ===================================================================== */
        #ecb-district-wrapper { position: relative; width: 100%; display: block; }

        #ecb-district-wrapper .select2-container { width: 100% !important; font-family: 'Tajawal', sans-serif !important; }
        #ecb-district-wrapper .select2-container--default .select2-selection--single {
            background-color: #ffffff !important;
            border: 1px solid #cbd5e1 !important;
            border-radius: 8px !important;
            height: 56px !important;
            padding: 0 15px !important;
            display: flex !important;
            align-items: center !important;
        }
        #ecb-district-wrapper .select2-container--default .select2-selection--single .select2-selection__rendered {
            color: #1e293b !important; text-align: right !important; font-weight: 600 !important; font-size: 16px !important;
            width: 100% !important; padding-right: 0 !important; line-height: normal !important;
        }
        #ecb-district-wrapper .select2-container--default .select2-selection--single .select2-selection__arrow {
            height: 100% !important; top: 0 !important; left: 15px !important; right: auto !important; display: flex !important; align-items: center !important;
        }
        #ecb-district-wrapper .select2-dropdown {
            background-color: #ffffff !important; border: 1px solid #12b3b6 !important; border-radius: 8px !important;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important; overflow: hidden !important; margin-top: 5px !important;
        }
        #ecb-district-wrapper .select2-results__option {
            padding: 12px 15px !important; color: #1e293b !important; font-size: 15px !important; font-weight: 500 !important;
            text-align: right !important; direction: rtl !important; border-bottom: 1px solid #f1f5f9 !important;
            background-color: #ffffff !important; transition: 0.2s !important;
        }
        #ecb-district-wrapper .select2-results__option--highlighted,
        #ecb-district-wrapper .select2-results__option:hover { background-color: rgba(18, 179, 182, 0.1) !important; color: #041a24 !important; font-weight: 700 !important; }
        #ecb-district-wrapper .select2-results__option[aria-selected="true"] { background-color: #12b3b6 !important; color: #000000 !important; font-weight: 800 !important; }

        .ecb-services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
        .ecb-srv-item { border: 1px solid var(--card-border); border-radius: var(--radius-lg); padding: 30px 20px; background: var(--card-bg); cursor: pointer; display: flex; flex-direction: column; align-items: center; text-align: center; transition: 0.4s ease; color: var(--text-light);}
        .ecb-srv-item:hover { border-color: var(--primary); background: rgba(18, 179, 182, 0.05); transform: translateY(-5px); }
        .ecb-srv-item.selected { border-color: var(--primary); background: rgba(18,179,182,0.15); box-shadow: 0 5px 20px var(--primary-glow);}
        .ecb-srv-icon { width: 60px; height: 60px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 1px solid rgba(18,179,182,0.2); background: rgba(18,179,182,0.1); font-size: 26px; color: var(--primary);}
        .ecb-price { color: var(--primary); font-weight: 800; font-size: 18px; }

        .ecb-sub-services { display: none; margin-top: 15px; width: 100%; text-align: right; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px;}
        .ecb-srv-item.selected .ecb-sub-services { display: block; }
        .ecb-radio-label { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; color:#ffffff;}
        .ecb-radio-label input { accent-color: var(--primary); width: 18px; height: 18px; }

        .ecb-calendar-wrap { background: rgba(255,255,255,0.02) !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 16px !important; padding: 25px !important; margin-bottom: 35px !important; }
        .ecb-cal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px !important; color:#ffffff !important;}
        .ecb-cal-header h4 { font-size: 18px !important; font-weight: 800 !important; color:#ffffff !important; margin: 0;}
        .ecb-cal-header button { background: rgba(255,255,255,0.05) !important; border: 1px solid var(--border-color) !important; border-radius: 10px !important; color: var(--text-light) !important; width: 40px !important; height: 40px !important; cursor: pointer !important; transition: 0.3s !important;}
        .ecb-cal-header button:hover { background: rgba(18,179,182,0.1) !important; border-color: var(--primary) !important;}
        .ecb-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px !important; text-align: center; }
        .ecb-cal-day-name { font-weight: 800; color: #ffffff !important; font-size: 13px !important; margin-bottom: 5px !important; text-align: center;}
        .ecb-cal-date { padding: 10px 0 !important; border-radius: 8px !important; cursor: pointer; font-weight: 700 !important; font-size: 14px !important; transition: 0.3s; background: rgba(255,255,255,0.05); color:#ffffff; border: 1px solid rgba(255,255,255,0.05) !important;}
        .ecb-cal-date:hover:not(.disabled) { background: rgba(18,179,182,0.1); border-color: var(--primary) !important; transform: translateY(-2px);}
        .ecb-cal-date.selected { background: var(--primary) !important; color: #000000 !important; font-weight: 900 !important; transform: translateY(-2px); border-color: var(--primary) !important;}
        .ecb-cal-date.disabled { color: rgba(255,255,255,0.2); cursor: not-allowed; background: transparent; border: 1px dashed rgba(255,255,255,0.05) !important; }

        .ecb-times-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 12px !important; margin-top: 20px !important; }
        .ecb-time-btn { padding: 14px !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 10px !important; text-align: center; cursor: pointer; background: rgba(255,255,255,0.03); font-weight: 700 !important; font-size: 15px !important; color:#ffffff; transition: 0.3s;}
        .ecb-time-btn:hover:not(.locked) { border-color: var(--primary) !important; background: rgba(18,179,182,0.1); transform: translateY(-2px); }
        .ecb-time-btn.selected { background: var(--primary) !important; color: #000000 !important; font-weight: 900 !important; transform: translateY(-2px); border-color: var(--primary) !important;}
        .ecb-time-btn.locked { background: rgba(255,0,0,0.05); color: #ff6b6b; cursor: not-allowed; text-decoration: line-through; border-color: rgba(255,0,0,0.1) !important; opacity: 0.6;}

        .ecb-summary { background: rgba(255,255,255,0.03); padding: 25px; border-radius: 12px; border: 1px solid var(--border-color); color:#ffffff;}
        .ecb-summary-row { display: flex; justify-content: flex-start; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 15px 0; font-size: 15px; align-items:flex-start;}
        .ecb-summary-row span.lbl { color: var(--primary); font-weight: 800; white-space: nowrap;}
        .ecb-summary-row span.val { color: #ffffff; font-weight: 500; }

        .ecb-btn { width: 100%; padding: 16px; border: 1px solid transparent; border-radius: var(--radius-sm); font-size: 16px; font-weight: 700; cursor: pointer; transition: 0.4s; font-family: 'Tajawal', sans-serif; text-align: center;}
        .ecb-btn-main { background: var(--primary); color: #041a24; box-shadow: 0 8px 20px var(--primary-glow); }
        .ecb-btn-main:hover { background: transparent; color: var(--primary); box-shadow: 0 0 15px var(--primary-glow) inset; border-color: var(--primary); transform: translateY(-3px);}
        .ecb-btn-sub { background: transparent; color: var(--text-light); border: 1px solid var(--card-border); margin-top: 10px;}
        .ecb-btn-sub:hover { background: var(--card-bg); border-color: var(--primary); transform: translateY(-3px);}

        #ecb-map { height: 250px; border-radius: 8px; border: 1px solid var(--border-color); margin-top: 15px; z-index: 1;}
    </style>

    <div class="ecb-wrap" id="ecbApp">
        <div class="ecb-header" id="ecb-header-box">
            <h3 id="ecb-step-title" class="ecb-step-title">البيانات الشخصية</h3>
            <div class="ecb-progress">
                <div class="ecb-prog-step active" id="ep-1"></div>
                <div class="ecb-prog-step" id="ep-2"></div>
                <div class="ecb-prog-step" id="ep-3"></div>
                <div class="ecb-prog-step" id="ep-4"></div>
            </div>
        </div>

        <div class="ecb-step active" id="es-1">
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
                <div class="ecb-form-row">
                    <label class="ecb-label">الاسم الكامل</label>
                    <input type="text" id="e_name" class="ecb-input" placeholder="أدخل الاسم">
                </div>
                <div class="ecb-form-row">
                    <label class="ecb-label">رقم الجوال (واتساب) - أساسي</label>
                    <input type="tel" id="e_phone" class="ecb-input" placeholder="05XXXXXXXX" dir="ltr" style="text-align: right !important; direction: ltr;">
                </div>
            </div>

            <div class="ecb-form-row">
                <label class="ecb-label">الحي (الرياض فقط)</label>
                <div id="ecb-district-wrapper">
                    <select id="e_district" class="ecb-input" style="width: 100%;">
                        <option value="">اختر الحي...</option>
                        <option value="الملقا">الملقا</option>
                        <option value="الياسمين">الياسمين</option>
                        <option value="النرجس">النرجس</option>
                        <option value="حطين">حطين</option>
                        <option value="الصحافة">الصحافة</option>
                        <option value="العقيق">العقيق</option>
                        <option value="الربيع">الربيع</option>
                        <option value="أخرى (داخل الرياض)">أخرى (داخل الرياض)</option>
                    </select>
                </div>
            </div>

            <div class="ecb-form-row">
                <label class="ecb-label">تفاصيل العنوان (الشارع / رقم المبنى)</label>
                <input type="text" id="e_street" class="ecb-input" placeholder="الشارع، أو رقم المبنى">
            </div>

            <button class="ecb-input" style="background:transparent; cursor:pointer; font-weight:800; color:var(--primary); border:1px dashed var(--primary); text-align: center;" onclick="ecbInitMap();" type="button">
                <i class="fa-solid fa-map-location-dot"></i> تحديد الموقع بدقة عبر الخريطة (اختياري)
            </button>
            <div id="map-wrap" style="display:none;">
                <div id="ecb-map"></div>
                <button type="button" class="ecb-btn ecb-btn-sub" style="border:none; background:rgba(255,255,255,0.1);" onclick="ecbLocateMap()">استخدم موقعي الحالي 🧭</button>
                <input type="hidden" id="e_lat"><input type="hidden" id="e_lng">
            </div>
        </div>

        <div class="ecb-step" id="es-2">
            <div class="ecb-services-grid">
                <?php if($services): foreach($services as $service):
                    $img = get_post_meta($service->ID, '_ecb_service_image', true) ?: 'https://placehold.co/400x250/072736/12b3b6?text=Service';
                    $sub_services_raw = get_post_meta($service->ID, '_ecb_sub_services', true);
                    $reg_price = get_post_meta($service->ID, '_regular_price', true);
                    $sale_price = get_post_meta($service->ID, '_sale_price', true);
                    $active_price = ($sale_price > 0 && $sale_price < $reg_price) ? $sale_price : $reg_price;

                    $has_subs = false;
                    $min_sub_price = -1;
                    if(!empty($sub_services_raw)) {
                        $subs = explode('|', $sub_services_raw);
                        foreach($subs as $sub) {
                            $parts = explode(':', $sub);
                            if(count($parts) >= 2) {
                                $has_subs = true;
                                $r = floatval(trim($parts[1]));
                                $s = isset($parts[2]) ? floatval(trim($parts[2])) : 0;
                                $p = ($s > 0 && $s < $r) ? $s : $r;
                                if($min_sub_price === -1 || $p < $min_sub_price) $min_sub_price = $p;
                            }
                        }
                    }

                    $onclick_attr = $has_subs ? "onclick=\"ecbExpandOnlySrv(this, {$service->ID}, '" . esc_attr($service->post_title) . "')\"" : "onclick=\"ecbSelectSrv(this, {$service->ID}, '" . esc_attr($service->post_title) . "', " . ($active_price ?: 0) . ")\"";
                    $cursor_style = 'cursor:pointer;';
                ?>
                <div class="ecb-srv-item" <?php echo $onclick_attr; ?> style="<?php echo $cursor_style; ?>">
                    <img src="<?php echo esc_url($img); ?>" class="ecb-srv-icon">
                    <h4 style="margin:0 0 10px; font-weight:800; font-size:18px; color:#ffffff;"><?php echo esc_html($service->post_title); ?></h4>
                    <div class="ecb-price">
                        <?php if($has_subs && $min_sub_price !== -1): ?>
                            <span style="font-size:14px; font-weight:normal;">تبدأ من </span> <?php echo wc_price($min_sub_price); ?>
                        <?php else: ?>
                            <?php if ($sale_price > 0 && $sale_price < $reg_price): ?>
                                <del style="color:#ffffff; opacity:0.6; font-size:14px; margin-left:5px;"><?php echo wc_price($reg_price); ?></del>
                                <?php echo wc_price($sale_price); ?>
                            <?php else: ?>
                                <?php echo wc_price($active_price ?: 0); ?>
                            <?php endif; ?>
                        <?php endif; ?>
                    </div>

                    <?php if(!empty($sub_services_raw)): ?>
                    <div class="ecb-sub-services" onclick="event.stopPropagation();">
                        <p style="font-size:13px; color:#ffffff; margin:0 0 10px;">اختر نوع الخدمة الفرعية:</p>
                        <?php
                        $subs = explode('|', $sub_services_raw);
                        foreach($subs as $sub):
                            $parts = explode(':', $sub);
                            if(count($parts) >= 2):
                                $sub_name = trim($parts[0]);
                                $sub_reg = floatval(trim($parts[1]));
                                $sub_sale = isset($parts[2]) ? floatval(trim($parts[2])) : 0;
                                $sub_price = ($sub_sale > 0 && $sub_sale < $sub_reg) ? $sub_sale : $sub_reg;
                        ?>
                        <label class="ecb-radio-label">
                            <span style="display:flex; align-items:center; gap:10px;">
                                <input type="radio" name="sub_srv_<?php echo $service->ID; ?>" value="<?php echo esc_attr($sub_name); ?>" onchange="ecbSelectSubSrv(<?php echo $service->ID; ?>, '<?php echo esc_attr($sub_name); ?>', <?php echo esc_attr($sub_price); ?>)">
                                <?php echo esc_html($sub_name); ?>
                            </span>
                            <strong style="color:var(--primary);">
                                <?php if ($sub_sale > 0 && $sub_sale < $sub_reg): ?>
                                    <del style="color:#ffffff; opacity:0.6; font-size:13px; margin-left:5px;"><?php echo wc_price($sub_reg); ?></del>
                                <?php endif; ?>
                                <?php echo wc_price($sub_price); ?>
                            </strong>
                        </label>
                        <?php endif; endforeach; ?>
                    </div>
                    <?php endif; ?>
                </div>
                <?php endforeach; endif; ?>
            </div>
            <input type="hidden" id="e_srv_id"><input type="hidden" id="e_srv_name">
            <input type="hidden" id="e_sub_srv_name"><input type="hidden" id="e_final_price">
        </div>

        <div class="ecb-step" id="es-3">
            <div class="ecb-calendar-wrap">
                <div class="ecb-cal-header">
                    <button onclick="ecbChangeMonth(1)" type="button"><i class="fa-solid fa-chevron-right"></i></button>
                    <h4 id="ecb_cal_month_year" style="margin:0; font-size:18px; font-weight:700;"></h4>
                    <button id="btn_prev_month" onclick="ecbChangeMonth(-1)" type="button"><i class="fa-solid fa-chevron-left"></i></button>
                </div>
                <div class="ecb-cal-grid">
                    <div class="ecb-cal-day-name">أحد</div><div class="ecb-cal-day-name">إثن</div><div class="ecb-cal-day-name">ثلا</div><div class="ecb-cal-day-name">أرب</div><div class="ecb-cal-day-name">خمي</div><div class="ecb-cal-day-name">جمع</div><div class="ecb-cal-day-name">سبت</div>
                </div>
                <div class="ecb-cal-grid" id="ecb_cal_days"></div>
            </div>
            <input type="hidden" id="e_date">

            <h4 style="margin-top:30px; margin-bottom: 15px; font-weight:800; color:#ffffff;">الأوقات المتاحة <i class="fa-regular fa-clock" style="color:var(--primary);"></i></h4>
            <div class="ecb-times-grid" id="e_times_grid">
                <p style="color:var(--text-placeholder); font-size:15px; grid-column: span 3; text-align:center;">يرجى تحديد يوم من التقويم لعرض الأوقات.</p>
            </div>
            <input type="hidden" id="e_time">
        </div>

        <div class="ecb-step" id="es-4">
            <div class="ecb-summary" id="e_summary_box"></div>

            <div style="margin-top:20px; background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; border: 1px dashed rgba(255,255,255,0.2);">
                <label class="ecb-label" style="color:#ffffff;">رمز الخصم (اختياري)</label>
                <div style="display:flex; gap:10px;">
                    <input type="text" id="e_coupon" class="ecb-input" placeholder="أدخل كوبون الخصم هنا" style="text-transform:uppercase;">
                    <button type="button" class="ecb-btn ecb-btn-sub" style="margin-top:0; width:auto; padding:0 20px; color:#12b3b6; border-color:#12b3b6;" onclick="ecbApplyCoupon()">تطبيق</button>
                </div>
                <div id="e_coupon_msg" style="font-size:13px; margin-top:8px;"></div>
            </div>

            <div style="text-align:center; margin-top:20px; color:#ffffff; font-size:14px;"><i class="fa-solid fa-lock" style="color:var(--primary);"></i> سيتم تحويلك لصفحة الدفع الآمنة لتأكيد الحجز.</div>
        </div>

        <div id="ecb-footer-box">
            <button id="e_btn_next" class="ecb-btn ecb-btn-main" onclick="ecbNext()">المتابعة للخطوة التالية</button>
            <button id="e_btn_prev" class="ecb-btn ecb-btn-sub" onclick="ecbPrev()" style="display:none;">السابق</button>
        </div>
    </div>

    <script>
        const secNonce = '<?php echo esc_js($nonce); ?>';
        const ajaxUrl = '<?php echo esc_url(admin_url('admin-ajax.php')); ?>';
        let step = 1; let map, marker, mapInit = false;
        const titles = [
            '<i class="fa-solid fa-user-pen" style="color:var(--primary);"></i> البيانات والموقع',
            '<i class="fa-solid fa-layer-group" style="color:var(--primary);"></i> اختيار الخدمة',
            '<i class="fa-regular fa-calendar-check" style="color:var(--primary);"></i> موعد الزيارة',
            '<i class="fa-solid fa-receipt" style="color:var(--primary);"></i> مراجعة وتأكيد',
        ];

        function ecbInitMap() {
            document.getElementById('map-wrap').style.display='block'; if(mapInit) return;
            map = L.map('ecb-map').setView([24.7136, 46.6753], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            marker = L.marker([24.7136, 46.6753], {draggable: true}).addTo(map);
            marker.on('dragend', function() { document.getElementById('e_lat').value = marker.getLatLng().lat; document.getElementById('e_lng').value = marker.getLatLng().lng; });
            mapInit = true; setTimeout(() => { map.invalidateSize(); }, 300);
        }
        function ecbLocateMap() {
            if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(pos => { let lat = pos.coords.latitude, lng = pos.coords.longitude; map.setView([lat, lng], 15); marker.setLatLng([lat, lng]); document.getElementById('e_lat').value = lat; document.getElementById('e_lng').value = lng; }); }
        }

        function ecbExpandOnlySrv(el, id, name) {
            document.querySelectorAll('.ecb-srv-item').forEach(c => c.classList.remove('selected')); el.classList.add('selected');
            document.getElementById('e_srv_id').value = id; document.getElementById('e_srv_name').value = name;
            document.getElementById('e_sub_srv_name').value = ''; document.getElementById('e_final_price').value = '';
            document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
        }

        function ecbSelectSrv(el, id, name, basePrice) {
            document.querySelectorAll('.ecb-srv-item').forEach(c => c.classList.remove('selected')); el.classList.add('selected');
            document.getElementById('e_srv_id').value = id; document.getElementById('e_srv_name').value = name;
            document.getElementById('e_sub_srv_name').value = ''; document.getElementById('e_final_price').value = basePrice;
            document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
            if(!el.querySelector('.ecb-sub-services') && document.getElementById('e_date').value) { ecbFetchTimes(); }
        }

        function ecbSelectSubSrv(pid, subName, subPrice) {
            document.getElementById('e_sub_srv_name').value = subName; document.getElementById('e_final_price').value = subPrice;
        }

        let currDate = new Date(); let absMonth = currDate.getMonth(); let absYear = currDate.getFullYear(); let calMonth = absMonth; let calYear = absYear;
        function ecbRenderCalendar() {
            const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
            document.getElementById('ecb_cal_month_year').innerText = monthNames[calMonth] + ' ' + calYear; document.getElementById('btn_prev_month').disabled = (calYear === absYear && calMonth === absMonth);
            let firstDay = new Date(calYear, calMonth, 1).getDay(); let daysInMonth = new Date(calYear, calMonth + 1, 0).getDate(); let grid = document.getElementById('ecb_cal_days'); grid.innerHTML = '';
            for(let i = 0; i < firstDay; i++) { grid.innerHTML += `<div></div>`; }
            let selectedStr = document.getElementById('e_date').value;
            for(let i = 1; i <= daysInMonth; i++) {
                let d = new Date(calYear, calMonth, i); let dStr = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
                let isPast = d < new Date(new Date().setHours(0,0,0,0)); let cls = 'ecb-cal-date'; if(isPast) cls += ' disabled'; if(dStr === selectedStr) cls += ' selected';
                let div = document.createElement('div'); div.className = cls; div.innerText = i;
                if(!isPast) { div.onclick = function() { document.querySelectorAll('.ecb-cal-date').forEach(el => el.classList.remove('selected')); this.classList.add('selected'); document.getElementById('e_date').value = dStr; ecbFetchTimes(); }; }
                grid.appendChild(div);
            }
        }
        function ecbChangeMonth(dir) { let newM = calMonth + dir; let newY = calYear; if(newM > 11) { newM = 0; newY++; } if(newM < 0) { newM = 11; newY--; } if(newY < absYear || (newY === absYear && newM < absMonth)) return; calMonth = newM; calYear = newY; ecbRenderCalendar(); }

        document.addEventListener('DOMContentLoaded', function() {
            ecbRenderCalendar();
            if(window.jQuery && jQuery.fn.select2) {
                jQuery('#e_district').select2({
                    dir: "rtl",
                    placeholder: "اختر الحي...",
                    minimumResultsForSearch: Infinity,
                    dropdownParent: jQuery('#ecb-district-wrapper'),
                    width: '100%'
                });
            }
        });

        function ecbFetchTimes() {
            let pid = document.getElementById('e_srv_id').value; let date = document.getElementById('e_date').value; let grid = document.getElementById('e_times_grid'); if(!pid || !date) return;
            grid.innerHTML = '<p style="grid-column:span 3;text-align:center; padding:20px;">جاري فحص الأوقات...</p>'; document.getElementById('e_time').value = '';
            jQuery.post(ajaxUrl, { action: 'ecb_check_slots', pid: pid, date: date, security: secNonce }, function(res) {
                if(res.success) {
                    grid.innerHTML = ''; let slots = res.data.slots;
                    if(slots.length === 0) { grid.innerHTML = '<p style="grid-column:span 3;text-align:center;color:#ff6b6b;">لا توجد مواعيد متاحة.</p>'; return; }
                    slots.forEach(slot => {
                        let btn = document.createElement('div'); btn.className = 'ecb-time-btn' + (slot.locked ? ' locked' : ''); btn.innerText = slot.time;
                        if(!slot.locked) { btn.onclick = function() { document.querySelectorAll('.ecb-time-btn').forEach(c => c.classList.remove('selected')); this.classList.add('selected'); document.getElementById('e_time').value = slot.time; }; }
                        grid.appendChild(btn);
                    });
                }
            });
        }

        function showError(msg) {
            if(typeof Swal !== 'undefined') {
                Swal.fire({ icon: 'warning', title: 'تنبيه', text: msg, confirmButtonText: 'حسناً', confirmButtonColor: '#12b3b6' });
            } else { alert(msg); }
        }

        function ecbNext() {
            if(step === 1) {
                if(!document.getElementById('e_name').value || !document.getElementById('e_phone').value || !document.getElementById('e_district').value) { return showError('الرجاء إكمال البيانات والحي.'); }
            }
            if(step === 2) {
                if(!document.getElementById('e_srv_id').value) return showError('الرجاء اختيار الخدمة.');
                let selectedItem = document.querySelector('.ecb-srv-item.selected');
                let hasSub = selectedItem.querySelector('.ecb-sub-services');
                if(hasSub && !document.getElementById('e_sub_srv_name').value) return showError('يرجى تحديد نوع الخدمة الفرعية.');
            }
            if(step === 3 && (!document.getElementById('e_date').value || !document.getElementById('e_time').value)) return showError('الرجاء تحديد اليوم والوقت.');
            if(step === 4) { ecbSubmit(); } else { step++; updateUI(); if(step===1){ ecbInitMap(); map.invalidateSize();} }
        }
        function ecbPrev() { if(step > 1) { step--; updateUI(); } }

        let activeDiscounts = 0;
        function ecbApplyCoupon() {
            let code = document.getElementById('e_coupon').value.trim();
            let msg = document.getElementById('e_coupon_msg');
            let basePrice = parseFloat(document.getElementById('e_final_price').value) || 0;
            if(!code) { msg.innerHTML = '<span style="color:#ef4444;">الرجاء إدخال الكوبون أولاً.</span>'; return; }

            msg.innerHTML = '<span style="color:#94a3b8;">جاري التحقق...</span>';
            jQuery.post(ajaxUrl, { action: 'ecb_validate_coupon', security: secNonce, code: code, total: basePrice }, function(res) {
                if(res.success) {
                    activeDiscounts = res.data.discount;
                    msg.innerHTML = '<span style="color:#10b981;">✅ تم تطبيق الخصم بنجاح! (' + res.data.discount_formatted + ')</span>';
                    updateUI();
                } else {
                    activeDiscounts = 0;
                    msg.innerHTML = '<span style="color:#ef4444;">❌ ' + res.data + '</span>';
                    updateUI();
                }
            }).fail(function() { msg.innerHTML = '<span style="color:#ef4444;">خطأ في الاتصال.</span>'; });
        }

        function updateUI() {
            document.querySelectorAll('.ecb-step').forEach(el => el.classList.remove('active')); document.getElementById('es-' + step).classList.add('active');
            document.querySelectorAll('.ecb-prog-step').forEach((el, i) => { el.classList.toggle('active', i < step); });
            document.getElementById('ecb-step-title').innerHTML = titles[step-1];

            document.getElementById('e_btn_prev').style.display = step === 1 ? 'none' : 'block';
            let nextBtn = document.getElementById('e_btn_next');
            if(step === 4) {
                nextBtn.innerHTML = 'المتابعة للدفع 💳';
                let mapLat = document.getElementById('e_lat') ? document.getElementById('e_lat').value : ''; let mapStr = mapLat ? '<i class="fa-solid fa-map-location-dot" style="color:var(--primary);"></i>' : '';
                let subSrv = document.getElementById('e_sub_srv_name').value;
                let srvDisplay = document.getElementById('e_srv_name').value + (subSrv ? ` (${subSrv})` : '');
                let basePrice = parseFloat(document.getElementById('e_final_price').value) || 0;
                let finalPayable = Math.max(0, basePrice - activeDiscounts);

                let priceHtml = basePrice + ' ريال';
                if(activeDiscounts > 0) {
                    priceHtml = `<del style="opacity:0.6; font-size:13px; margin-left:5px;">${basePrice} ريال</del> <strong style="color:#10b981;">${finalPayable} ريال</strong>`;
                }

                document.getElementById('e_summary_box').innerHTML = `
                    <div class="ecb-summary-row"><span class="lbl">الاسم:</span> <span class="val">${document.getElementById('e_name').value}</span></div>
                    <div class="ecb-summary-row"><span class="lbl">الجوال:</span> <span class="val" style="direction:ltr;">${document.getElementById('e_phone').value}</span></div>
                    <div class="ecb-summary-row"><span class="lbl">الموقع:</span> <span class="val">الرياض - حي ${document.getElementById('e_district').value} <br><span style="font-size: 13px; opacity: 0.8;">${document.getElementById('e_street').value}</span> ${mapStr}</span></div>
                    <div class="ecb-summary-row"><span class="lbl">الخدمة:</span> <span class="val" style="color:var(--primary);">${srvDisplay}</span></div>
                    <div class="ecb-summary-row"><span class="lbl">السعر:</span> <span class="val">${priceHtml}</span></div>
                    <div class="ecb-summary-row"><span class="lbl">الموعد:</span> <span class="val">${document.getElementById('e_date').value} (${document.getElementById('e_time').value})</span></div>`;
            } else { nextBtn.innerHTML = 'المتابعة للخطوة التالية'; }
        }

        function ecbSubmit() {
            let btn = document.getElementById('e_btn_next'); btn.innerText = 'جاري التحويل للدفع... ⏳'; btn.disabled = true;
            let lat = document.getElementById('e_lat') ? document.getElementById('e_lat').value : ''; let lng = document.getElementById('e_lng') ? document.getElementById('e_lng').value : '';
            let mapUrl = lat ? `https://www.google.com/maps?q=${lat},${lng}` : '';

            let data = { action: 'ecb_create_direct_order', security: secNonce, pid: document.getElementById('e_srv_id').value, sub_srv: document.getElementById('e_sub_srv_name').value, price: document.getElementById('e_final_price').value, name: document.getElementById('e_name').value, phone: document.getElementById('e_phone').value, district: document.getElementById('e_district').value, street: document.getElementById('e_street').value, map: mapUrl, date: document.getElementById('e_date').value, time: document.getElementById('e_time').value, coupon: document.getElementById('e_coupon') ? document.getElementById('e_coupon').value : '' };

            jQuery.post(ajaxUrl, data, function(res) {
                if(res.success && res.data.payment_url) {
                    window.location.href = res.data.payment_url;
                } else { showError(res.data); btn.innerHTML = 'المتابعة للدفع 💳'; btn.disabled = false; ecbFetchTimes(); }
            }).fail(function() { showError('خطأ في الاتصال.'); btn.disabled = false; });
        }
    </script>
    <?php return ob_get_clean();
    }

/* ============================================================================
* 3. AJAX ENDPOINTS: SECURE ORDER CREATION & REDIRECT TO GATEWAY
* ============================================================================ */
add_action('wp_ajax_ecb_check_slots', 'ecb_check_slots');
add_action('wp_ajax_nopriv_ecb_check_slots', 'ecb_check_slots');
function ecb_check_slots() {
    check_ajax_referer('ecb_booking_secure_nonce', 'security');
    $pid = intval($_POST['pid']); $date = sanitize_text_field($_POST['date']);

    $capacity = get_post_meta($pid, '_csb_service_capacity', true) ?: 1;
    $custom_slots_json = get_post_meta($pid, "_ecb_slots_{$date}", true);
    $times = $custom_slots_json ? json_decode($custom_slots_json, true) : array_map('trim', explode(',', get_post_meta($pid, '_csb_service_times', true) ?: '08:00 AM, 10:00 AM, 01:00 PM'));

    $orders = wc_get_orders(array('limit' => -1, 'status' => array('wc-processing', 'wc-completed', 'wc-on-hold', 'wc-pending'), 'meta_query' => array('relation' => 'AND', array('key' => 'ecb_date', 'value' => $date), array('key' => 'ecb_product_id', 'value' => $pid))));
    $booked_counts = array(); foreach($orders as $o) { $t = $o->get_meta('ecb_time'); $booked_counts[$t] = ($booked_counts[$t] ?? 0) + 1; }

    $frontend_slots = [];
    foreach($times as $t) {
        $is_locked = get_post_meta($pid, "_ecb_lock_{$date}_{$t}", true) === 'yes';
        $frontend_slots[] = array('time' => $t, 'locked' => ($is_locked || (isset($booked_counts[$t]) && $booked_counts[$t] >= $capacity)));
    }
    wp_send_json_success(array('slots' => $frontend_slots));
}

add_action('wp_ajax_ecb_validate_coupon', 'ecb_validate_coupon');
add_action('wp_ajax_nopriv_ecb_validate_coupon', 'ecb_validate_coupon');
function ecb_validate_coupon() {
    check_ajax_referer('ecb_booking_secure_nonce', 'security');
    $code = sanitize_text_field($_POST['code']);
    $total = floatval($_POST['total']);
    $lang = isset($_POST['lang']) ? sanitize_text_field($_POST['lang']) : 'ar';

    if(empty($code)) wp_send_json_error($lang == 'en' ? 'Coupon code is blank.' : 'الكوبون فارغ.');
    if($total <= 0) wp_send_json_error($lang == 'en' ? 'Please select a service first.' : 'الرجاء اختيار الخدمة أولاً.');

    $coupon = new WC_Coupon($code);
    if(!$coupon->get_id()) {
        wp_send_json_error($lang == 'en' ? 'Invalid or non-existent coupon.' : 'الكوبون غير صحيح أو غير موجود.');
    }

    try {
        if(!$coupon->is_valid()) {
            wp_send_json_error($lang == 'en' ? 'Expired or invalid coupon.' : 'الكوبون منتهي الصلاحية أو غير متاح للاستخدام.');
        }
    } catch(Exception $e) {
        wp_send_json_error($lang == 'en' ? 'Invalid coupon.' : 'الكوبون غير متاح للاستخدام.');
    }

    $discount = 0;
    $type = $coupon->get_discount_type();
    $amount = floatval($coupon->get_amount());

    if($type === 'percent') {
        $discount = $total * ($amount / 100);
    } elseif($type === 'fixed_cart' || $type === 'fixed_product') {
        $discount = $amount;
    }

    if($discount > $total) $discount = $total;

    wp_send_json_success(array(
        'discount' => round($discount, 2),
        'discount_formatted' => wc_price($discount)
    ));
}

/* ============================================================================
* 3b. ORDER CREATION — FIX: Prevent user duplication
* ============================================================================ */
add_action('wp_ajax_ecb_create_direct_order', 'ecb_create_direct_order');
add_action('wp_ajax_nopriv_ecb_create_direct_order', 'ecb_create_direct_order');
function ecb_create_direct_order() {
    check_ajax_referer('ecb_booking_secure_nonce', 'security');

    $pid = intval($_POST['pid']); $date = sanitize_text_field($_POST['date']); $time = sanitize_text_field($_POST['time']);
    $cap = get_post_meta($pid, '_csb_service_capacity', true) ?: 1;
    $is_locked = get_post_meta($pid, "_ecb_lock_{$date}_{$time}", true) === 'yes';

    $active_orders = wc_get_orders(array('limit' => -1, 'status' => array('wc-processing', 'wc-completed', 'wc-pending'), 'meta_query' => array('relation' => 'AND', array('key' => 'ecb_date', 'value' => $date), array('key' => 'ecb_time', 'value' => $time), array('key' => 'ecb_product_id', 'value' => $pid))));
    if($is_locked || count($active_orders) >= $cap) wp_send_json_error('عذراً، هذا الموعد تم حجزه للتو.');

    $product = wc_get_product($pid); if(!$product) wp_send_json_error('الخدمة غير موجودة.');

    $phone = sanitize_text_field($_POST['phone']); $name = sanitize_text_field($_POST['name']);
    $clean_phone = preg_replace('/[^0-9]/', '', $phone);
    $email = 'wa_' . $clean_phone . '@engaz.local';

    // ===== FIX: Check for existing user by email OR phone to prevent duplication =====
    $existing_user = get_user_by('email', $email);
    if(!$existing_user) {
        // Also search by phone meta in case user was created by WooCommerce checkout
        $user_query = new WP_User_Query(array(
            'meta_key' => 'billing_phone',
            'meta_value' => $phone,
            'number' => 1
        ));
        $found = $user_query->get_results();
        if(!empty($found)) {
            $existing_user = $found[0];
            $email = $existing_user->user_email; // Use their existing email
        }
    }

    $customer_id = 0;
    if($existing_user) {
        $customer_id = $existing_user->ID;
    }

    $order = wc_create_order(array('customer_id' => $customer_id));
    $item = new WC_Order_Item_Product(); $item->set_product( $product ); $item->set_quantity( 1 );

    $custom_price = floatval($_POST['price']);
    $final_price = ($custom_price > 0) ? $custom_price : $product->get_price();
    $item->set_subtotal( $final_price ); $item->set_total( $final_price );

    $item->add_meta_data( 'تاريخ الزيارة', $date, true ); $item->add_meta_data( 'وقت الزيارة', $time, true );
    $sub_srv = sanitize_text_field($_POST['sub_srv']);
    if(!empty($sub_srv)) $item->add_meta_data( 'نوع الخدمة', $sub_srv, true );
    $order->add_item( $item );

    $address = array('first_name' => $name, 'email' => $email, 'phone' => $phone, 'city' => 'الرياض', 'address_1' => sanitize_text_field($_POST['district']) . ' - ' . sanitize_text_field($_POST['street']));
    $order->set_address( $address, 'billing' );

    $order->update_meta_data('ecb_date', $date); $order->update_meta_data('ecb_time', $time); $order->update_meta_data('ecb_product_id', $pid);
    if(!empty($_POST['map'])) $order->update_meta_data('موقع الخريطة', esc_url_raw($_POST['map']));

    $coupon_code = sanitize_text_field($_POST['coupon']);
    if(!empty($coupon_code)) {
        $coupon = new WC_Coupon($coupon_code);
        if($coupon->is_valid()) {
            $order->apply_coupon($coupon_code);
        }
    }

    $order->calculate_totals();
    $order->update_status('pending', 'SaaS Mobile Booking. Awaiting Payment.');

    wp_send_json_success(array('order_id' => $order->get_id(), 'payment_url' => $order->get_checkout_payment_url()));
}

/* ============================================================================
* 4. SAAS DASHBOARD (ADMIN PANEL) — V2.4 with Testimonials, Portfolio, Plans, Services
* ============================================================================ */
add_action('admin_menu', 'ecb_saas_dashboard_menu');
function ecb_saas_dashboard_menu() { add_menu_page('Engaz Care', 'Engaz CRM', 'manage_options', 'ecb-saas-dash', 'ecb_saas_dashboard_html', 'dashicons-store', 2); }

function ecb_saas_dashboard_html() {
    if (!current_user_can('manage_options')) return;

    // ===== HANDLE ALL FORM SUBMISSIONS =====
    if(isset($_POST['action']) && check_admin_referer('ecb_save_srv')) {
        if($_POST['action'] == 'update_service_meta') {
            $pid = intval($_POST['service_id']);
            $reg_p = sanitize_text_field($_POST['reg_price']);
            $sale_p = sanitize_text_field($_POST['sale_price']);
            update_post_meta($pid, '_csb_service_capacity', intval($_POST['cap']));
            update_post_meta($pid, '_csb_service_times', sanitize_text_field($_POST['times']));
            update_post_meta($pid, '_regular_price', $reg_p);
            update_post_meta($pid, '_sale_price', $sale_p);
            update_post_meta($pid, '_price', ($sale_p > 0 && $sale_p < $reg_p) ? $sale_p : $reg_p);
            update_post_meta($pid, '_ecb_service_image', esc_url_raw($_POST['srv_img']));
            update_post_meta($pid, '_ecb_sub_services', sanitize_text_field($_POST['sub_services']));
            // NEW: Save service description
            if(isset($_POST['srv_desc'])) {
                update_post_meta($pid, '_ecb_service_description', sanitize_textarea_field($_POST['srv_desc']));
            }
            // NEW: Update service title
            if(!empty($_POST['srv_title'])) {
                wp_update_post(array('ID' => $pid, 'post_title' => sanitize_text_field($_POST['srv_title'])));
            }
            echo '<div class="notice notice-success is-dismissible"><p>تم تحديث الخدمة بنجاح!</p></div>';
        } elseif ($_POST['action'] == 'add_new_service') {
            $post_id = wp_insert_post(array('post_title' => sanitize_text_field($_POST['new_title']), 'post_type' => 'product', 'post_status' => 'publish'));
            wp_set_object_terms($post_id, 'booking-services', 'product_cat');
            $new_reg = sanitize_text_field($_POST['new_price']);
            $new_sale = sanitize_text_field($_POST['new_sale_price']);
            update_post_meta($post_id, '_csb_service_capacity', intval($_POST['new_cap']));
            update_post_meta($post_id, '_csb_service_times', sanitize_text_field($_POST['new_times']));
            update_post_meta($post_id, '_regular_price', $new_reg);
            update_post_meta($post_id, '_sale_price', $new_sale);
            update_post_meta($post_id, '_price', ($new_sale > 0 && $new_sale < $new_reg) ? $new_sale : $new_reg);
            update_post_meta($post_id, '_ecb_sub_services', sanitize_text_field($_POST['new_sub']));
            echo '<div class="notice notice-success is-dismissible"><p>تم إضافة الخدمة الجديدة بنجاح!</p></div>';
        }
    }

    // ===== HANDLE TESTIMONIALS SAVE =====
    if(isset($_POST['ecb_testimonial_action']) && check_admin_referer('ecb_save_testimonials')) {
        $action = sanitize_text_field($_POST['ecb_testimonial_action']);
        $testimonials = get_option('ecb_testimonials', array());

        if($action === 'add') {
            $testimonials[] = array(
                'id' => uniqid('tst_'),
                'name' => sanitize_text_field($_POST['tst_name']),
                'text' => sanitize_textarea_field($_POST['tst_text']),
                'rating' => intval($_POST['tst_rating']),
                'image' => esc_url_raw($_POST['tst_image']),
            );
            update_option('ecb_testimonials', $testimonials);
            echo '<div class="notice notice-success is-dismissible"><p>تم إضافة التقييم بنجاح!</p></div>';
        } elseif($action === 'delete') {
            $del_id = sanitize_text_field($_POST['tst_id']);
            $testimonials = array_filter($testimonials, function($t) use ($del_id) { return $t['id'] !== $del_id; });
            update_option('ecb_testimonials', array_values($testimonials));
            echo '<div class="notice notice-success is-dismissible"><p>تم حذف التقييم.</p></div>';
        } elseif($action === 'update') {
            $upd_id = sanitize_text_field($_POST['tst_id']);
            foreach($testimonials as &$t) {
                if($t['id'] === $upd_id) {
                    $t['name'] = sanitize_text_field($_POST['tst_name']);
                    $t['text'] = sanitize_textarea_field($_POST['tst_text']);
                    $t['rating'] = intval($_POST['tst_rating']);
                    $t['image'] = esc_url_raw($_POST['tst_image']);
                }
            }
            update_option('ecb_testimonials', $testimonials);
            echo '<div class="notice notice-success is-dismissible"><p>تم تحديث التقييم.</p></div>';
        }
    }

    // ===== HANDLE PORTFOLIO SAVE =====
    if(isset($_POST['ecb_portfolio_action']) && check_admin_referer('ecb_save_portfolio')) {
        $action = sanitize_text_field($_POST['ecb_portfolio_action']);
        $portfolio = get_option('ecb_portfolio', array());

        if($action === 'add') {
            $portfolio[] = array(
                'id' => uniqid('pf_'),
                'title' => sanitize_text_field($_POST['pf_title']),
                'link' => esc_url_raw($_POST['pf_link']),
                'description' => sanitize_textarea_field($_POST['pf_description']),
                'image' => esc_url_raw($_POST['pf_image']),
            );
            update_option('ecb_portfolio', $portfolio);
            echo '<div class="notice notice-success is-dismissible"><p>تم إضافة العمل بنجاح!</p></div>';
        } elseif($action === 'delete') {
            $del_id = sanitize_text_field($_POST['pf_id']);
            $portfolio = array_filter($portfolio, function($p) use ($del_id) { return $p['id'] !== $del_id; });
            update_option('ecb_portfolio', array_values($portfolio));
            echo '<div class="notice notice-success is-dismissible"><p>تم حذف العمل.</p></div>';
        } elseif($action === 'update') {
            $upd_id = sanitize_text_field($_POST['pf_id']);
            foreach($portfolio as &$p) {
                if($p['id'] === $upd_id) {
                    $p['title'] = sanitize_text_field($_POST['pf_title']);
                    $p['link'] = esc_url_raw($_POST['pf_link']);
                    $p['description'] = sanitize_textarea_field($_POST['pf_description']);
                    $p['image'] = esc_url_raw($_POST['pf_image']);
                }
            }
            update_option('ecb_portfolio', $portfolio);
            echo '<div class="notice notice-success is-dismissible"><p>تم تحديث العمل.</p></div>';
        }
    }

    // ===== HANDLE PLANS SAVE =====
    if(isset($_POST['ecb_plans_action']) && check_admin_referer('ecb_save_plans')) {
        $action = sanitize_text_field($_POST['ecb_plans_action']);
        $plans = get_option('ecb_plans', array());

        if($action === 'add') {
            $plans[] = array(
                'id' => uniqid('plan_'),
                'name' => sanitize_text_field($_POST['plan_name']),
                'price' => sanitize_text_field($_POST['plan_price']),
                'period' => sanitize_text_field($_POST['plan_period']),
                'features' => sanitize_textarea_field($_POST['plan_features']),
                'is_popular' => isset($_POST['plan_popular']) ? 1 : 0,
            );
            update_option('ecb_plans', $plans);
            echo '<div class="notice notice-success is-dismissible"><p>تم إضافة الباقة بنجاح!</p></div>';
        } elseif($action === 'delete') {
            $del_id = sanitize_text_field($_POST['plan_id']);
            $plans = array_filter($plans, function($p) use ($del_id) { return $p['id'] !== $del_id; });
            update_option('ecb_plans', array_values($plans));
            echo '<div class="notice notice-success is-dismissible"><p>تم حذف الباقة.</p></div>';
        } elseif($action === 'update') {
            $upd_id = sanitize_text_field($_POST['plan_id']);
            foreach($plans as &$p) {
                if($p['id'] === $upd_id) {
                    $p['name'] = sanitize_text_field($_POST['plan_name']);
                    $p['price'] = sanitize_text_field($_POST['plan_price']);
                    $p['period'] = sanitize_text_field($_POST['plan_period']);
                    $p['features'] = sanitize_textarea_field($_POST['plan_features']);
                    $p['is_popular'] = isset($_POST['plan_popular']) ? 1 : 0;
                }
            }
            update_option('ecb_plans', $plans);
            echo '<div class="notice notice-success is-dismissible"><p>تم تحديث الباقة.</p></div>';
        }
    }

    $orders = wc_get_orders(array('limit' => -1, 'status' => array('wc-completed', 'wc-processing', 'wc-pending')));
    $services = get_posts(array('post_type' => 'product', 'posts_per_page' => -1, 'tax_query' => array(array('taxonomy' => 'product_cat', 'field' => 'slug', 'terms' => 'booking-services'))));

    $calendar_grouped_events = []; $total_rev = 0; $clients = [];
    foreach($orders as $o) {
        if($o->get_status() !== 'pending') $total_rev += $o->get_total();
        $phone = $o->get_billing_phone();
        if($phone && $o->get_status() !== 'pending') {
            if(!isset($clients[$phone])) $clients[$phone] = ['name' => $o->get_billing_first_name(), 'spend' => 0, 'bookings' => 0];
            $clients[$phone]['spend'] += $o->get_total(); $clients[$phone]['bookings']++;
        }
        $order_date = $o->get_meta('ecb_date');
        if($order_date) {
            if(!isset($calendar_grouped_events[$order_date])) { $calendar_grouped_events[$order_date] = ['count' => 0, 'orders' => []]; }
            $srv_name = ""; foreach($o->get_items() as $item) { $srv_name = $item->get_name(); break; }
            $calendar_grouped_events[$order_date]['count']++;
            $calendar_grouped_events[$order_date]['orders'][] = ['id' => $o->get_id(), 'time' => $o->get_meta('ecb_time'), 'srv' => $srv_name, 'name' => $o->get_billing_first_name(), 'phone' => $phone, 'status' => $o->get_status()];
        }
    }

    $calendar_events = [];
    foreach($calendar_grouped_events as $date => $data) {
        $calendar_events[] = array('title' => "{$data['count']} Orders", 'start' => $date, 'color' => '#0ea5e9', 'extendedProps' => ['orders' => wp_json_encode($data['orders']), 'date' => $date]);
    }
    uasort($clients, function($a, $b) { return $b['spend'] <=> $a['spend']; });
    $top_suggestions = array_slice($clients, 0, 3, true);

    // Load saved data
    $testimonials = get_option('ecb_testimonials', array());
    $portfolio = get_option('ecb_portfolio', array());
    $plans = get_option('ecb_plans', array());
    ?>
    <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js'></script>
    <style>
        .ecb-admin { font-family: 'Inter', -apple-system, sans-serif; padding: 30px; background: #f8fafc; color: #1e293b; min-height: 100vh; margin-left: -20px; box-sizing: border-box;}
        .ecb-admin * { box-sizing: border-box; }
        .ecb-admin h1 { color: #0f172a; font-size: 28px; font-weight: 800; margin-bottom: 25px; letter-spacing: -0.5px;}
        .ecb-nav { display: flex; gap: 12px; background: #ffffff; padding: 15px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); flex-wrap:wrap;}
        .ecb-nav-item { padding: 12px 24px; border-radius: 8px; cursor: pointer; border: none; background: transparent; font-weight: 600; color: #64748b; font-size: 15px; transition: 0.2s;}
        .ecb-nav-item.active { background: #e0f2fe; color: #0284c7; box-shadow: 0 2px 4px rgba(2, 132, 199, 0.1);}
        .ecb-nav-item:hover:not(.active) { background: #f1f5f9; color: #0f172a; }
        .ecb-tab { display: none; background: #ffffff; border-radius: 12px; padding: 25px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;}
        .ecb-tab.active { display: block; animation: ecbFadeInTab 0.3s ease; }
        @keyframes ecbFadeInTab { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

        .ecb-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 35px;}
        .ecb-stat-card { background: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 5px solid #12b3b6; box-shadow: 0 2px 4px rgba(0,0,0,0.02);}
        .ecb-stat-card h4 { margin: 0 0 10px 0; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;}
        .ecb-stat-card h2 { margin: 0; color: #0f172a; font-size: 32px; font-weight: 800;}

        .ecb-table { width: 100%; border-collapse: separate; border-spacing: 0; text-align: left; font-size: 14px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;}
        .ecb-table th, .ecb-table td { padding: 16px; border-bottom: 1px solid #e2e8f0; vertical-align:middle;}
        .ecb-table th { background: #f8fafc; color: #475569; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px;}
        .ecb-table tr:last-child td { border-bottom: none; }
        .ecb-table tbody tr:hover { background: #f8fafc; }

        .btn-status { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; color: white; font-weight:600; font-size:13px; margin-top:5px; transition: 0.2s;}
        .btn-complete { background: #10b981; } .btn-complete:hover { background: #059669; }
        .btn-wa { background: #25D366; color:white; text-decoration:none; padding:8px 12px; border-radius:6px; display:inline-flex; align-items:center; gap: 5px; font-weight: 500; font-size: 13px; transition: 0.2s; border: none; cursor: pointer;}
        .btn-wa:hover { background: #1da851; color: white; }

        .ecb-status-select { padding: 6px 12px; border-radius: 6px; border: 1px solid #cbd5e1; font-weight: 600; font-size: 13px; cursor: pointer; width: 100%; margin-top: 5px; background-color: #f8fafc; color: #334155; transition: 0.2s; }
        .ecb-status-select:focus { outline: none; border-color: #0284c7; box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.2); }

        .ecb-input-group { margin-bottom: 18px; } .ecb-input-group label { display:block; font-weight:600; margin-bottom:8px; font-size:13px; color:#334155;} .ecb-input-group input, .ecb-input-group textarea { width: 100%; padding:10px 12px; border:1px solid #cbd5e1; border-radius:6px; transition: 0.2s;}
        .ecb-input-group input:focus, .ecb-input-group textarea:focus { outline:none; border-color: #12b3b6; box-shadow: 0 0 0 3px rgba(18,179,182,0.1); }

        .ecb-srv-layout { display: flex; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background:#f8fafc;}
        .ecb-srv-sidebar { width: 250px; background: #fff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; }
        .ecb-srv-btn { padding: 15px; border: none; background: transparent; text-align: left; cursor: pointer; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569; }
        .ecb-srv-btn.active { background: #f1f5f9; color: #12b3b6; border-left: 4px solid #12b3b6; }
        .ecb-srv-content { padding: 20px; flex: 1; }
        .ecb-srv-pane { display: none; } .ecb-srv-pane.active { display: block; }

        .ecb-slot-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-top:15px;}
        .ecb-slot { padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; text-align: center;}
        .ecb-slot.booked { border-color: #3b82f6; background: #eff6ff; }
        .ecb-slot.locked { border-color: #ef4444; background: #fef2f2; }
        .btn-action { color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 12px; width: 100%; margin-top:5px;}
        .btn-lock { background: #ef4444; } .btn-unlock { background: #10b981; } .btn-book { background: #0284c7; } .btn-delete { background: #64748b; }

        .ecb-modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; display:none; align-items:center; justify-content:center; }
        .ecb-modal-box { background:#fff; padding:30px; border-radius:12px; max-width:600px; width:90%; position:relative; box-shadow:0 10px 25px rgba(0,0,0,0.2); }

        /* NEW: Cards for Testimonials, Portfolio, Plans */
        .ecb-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; margin-top: 20px; }
        .ecb-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; position: relative; transition: 0.2s; }
        .ecb-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .ecb-card-img { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0; }
        .ecb-card-actions { display: flex; gap: 8px; margin-top: 15px; }
        .ecb-card-actions button { padding: 6px 14px; border-radius: 6px; border: 1px solid #cbd5e1; background: #fff; cursor: pointer; font-size: 12px; font-weight: 600; transition: 0.2s; }
        .ecb-card-actions .btn-edit { color: #0284c7; border-color: #0284c7; }
        .ecb-card-actions .btn-edit:hover { background: #e0f2fe; }
        .ecb-card-actions .btn-del { color: #ef4444; border-color: #ef4444; }
        .ecb-card-actions .btn-del:hover { background: #fef2f2; }
        .ecb-stars { color: #f59e0b; font-size: 14px; }
        .ecb-add-form { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 25px; margin-bottom: 25px; }

        /* Portfolio preview card */
        .ecb-pf-preview { display: flex; gap: 15px; align-items: flex-start; }
        .ecb-pf-preview img { width: 120px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0; }
        .ecb-pf-preview .pf-info { flex: 1; }
        .ecb-pf-preview .pf-info h4 { margin: 0 0 5px; font-size: 15px; color: #0f172a; }
        .ecb-pf-preview .pf-info p { margin: 0 0 5px; font-size: 13px; color: #64748b; }
        .ecb-pf-preview .pf-info a { font-size: 12px; color: #0284c7; }

        /* Plans card */
        .ecb-plan-card { border-left: 4px solid #12b3b6; }
        .ecb-plan-card.popular { border-left-color: #f59e0b; background: #fffbeb; }
        .ecb-plan-price { font-size: 28px; font-weight: 800; color: #0f172a; }
        .ecb-plan-period { font-size: 13px; color: #64748b; }
        .ecb-plan-features { list-style: none; padding: 0; margin: 10px 0 0; }
        .ecb-plan-features li { padding: 4px 0; font-size: 13px; color: #475569; }
        .ecb-plan-features li::before { content: "✓ "; color: #10b981; font-weight: bold; }

        /* Service image preview in admin */
        .ecb-srv-img-preview { width: 100px; height: 100px; object-fit: cover; border-radius: 8px; border: 2px solid #e2e8f0; margin-top: 5px; }
    </style>

    <div class="ecb-admin">
        <h1>Engaz Care Hub (V2.4 - Full CRM)</h1>

        <div class="ecb-nav">
            <button class="ecb-nav-item active" onclick="ecbSwitchTab(event, 'tab-orders')"><span class="dashicons dashicons-chart-bar"></span> Overview & Orders</button>
            <button class="ecb-nav-item" onclick="ecbSwitchTab(event, 'tab-cal'); setTimeout(()=>calendar.render(), 100);"><span class="dashicons dashicons-calendar-alt"></span> Master Calendar</button>
            <button class="ecb-nav-item" onclick="ecbSwitchTab(event, 'tab-srv')"><span class="dashicons dashicons-admin-generic"></span> Services & Slots</button>
            <button class="ecb-nav-item" onclick="ecbSwitchTab(event, 'tab-testimonials')"><span class="dashicons dashicons-format-quote"></span> Testimonials</button>
            <button class="ecb-nav-item" onclick="ecbSwitchTab(event, 'tab-portfolio')"><span class="dashicons dashicons-portfolio"></span> Portfolio</button>
            <button class="ecb-nav-item" onclick="ecbSwitchTab(event, 'tab-plans')"><span class="dashicons dashicons-tickets-alt"></span> Plans & Pricing</button>
            <button class="ecb-nav-item" onclick="ecbSwitchTab(event, 'tab-crm')"><span class="dashicons dashicons-awards"></span> CRM & Loyalty</button>
        </div>

        <!-- ==================== TAB: ORDERS ==================== -->
        <div id="tab-orders" class="ecb-tab active">
            <div class="ecb-stats">
                <div class="ecb-stat-card"><h4>Paid Revenue</h4><h2><?php echo wc_price($total_rev); ?></h2></div>
                <div class="ecb-stat-card"><h4>Total Orders</h4><h2><?php echo count($orders); ?></h2></div>
                <div class="ecb-stat-card"><h4>VIP Clients</h4><h2><?php echo count($clients); ?></h2></div>
            </div>

            <h2>Status Management (Recent Orders)</h2>
            <div style="overflow-x:auto;">
                <table class="ecb-table">
                    <thead><tr><th>ID & Payment Status</th><th>Client (WhatsApp)</th><th>Service & Details</th><th>Time & Method</th><th>Status Management</th></tr></thead>
                    <tbody>
                        <?php foreach (array_slice($orders, 0, 30) as $o):
                            $phone = $o->get_billing_phone();
                            $wa_num = '966' . ltrim($phone, '0');
                            $s_color = '#64748b';
                            $status = $o->get_status();
                            if($status == 'completed') $s_color = '#10b981';
                            if($status == 'processing') $s_color = '#3b82f6';
                            if($status == 'pending') $s_color = '#f59e0b';
                            if($status == 'on-hold') $s_color = '#f97316';
                            if($status == 'cancelled' || $status == 'failed') $s_color = '#ef4444';
                        ?>
                        <tr>
                            <td>
                                <strong><a href="#" style="text-decoration:none; color:#0f172a; font-size:15px;" onclick="ecbOpenOrderModal(<?php echo $o->get_id(); ?>)">#<?php echo $o->get_id(); ?></a></strong><br>
                                <span style="display:inline-block; padding:4px 8px; border-radius:4px; background:<?php echo $s_color; ?>15; color:<?php echo $s_color; ?>; font-size:11px; font-weight:700; margin-top:5px; text-transform:uppercase;"><?php echo str_replace('-', ' ', $status); ?></span>
                            </td>
                            <td>
                                <strong><?php echo esc_html($o->get_billing_first_name() . ' ' . $o->get_billing_last_name()); ?></strong><br>
                                <a href="https://wa.me/<?php echo esc_attr($wa_num); ?>" target="_blank" class="btn-wa" style="margin-top:5px;"><span class="dashicons dashicons-whatsapp"></span> <?php echo esc_html($phone); ?></a>
                            </td>
                            <td>
                                <strong><?php foreach($o->get_items() as $i) { echo esc_html($i->get_name()); if($i->get_meta('نوع الخدمة')) echo ' ('.esc_html($i->get_meta('نوع الخدمة')).')'; break; } ?></strong><br>
                                <div style="color:#334155; font-size:13px; background:#f1f5f9; padding:8px; border-radius:6px; margin-top:8px; border-right:3px solid #0ea5e9; font-weight:500;">
                                    <span class="dashicons dashicons-location" style="font-size:14px; margin-top:2px;"></span> <?php echo esc_html($o->get_billing_address_1()); ?>
                                </div>
                                <?php if($o->get_meta('موقع الخريطة')): ?><a href="<?php echo esc_url($o->get_meta('موقع الخريطة')); ?>" target="_blank" style="font-size:12px; color:#0284c7; text-decoration:none; display:inline-flex; align-items:center; gap:4px; margin-top:6px;"><span class="dashicons dashicons-location-alt"></span> View on Map</a><?php endif; ?>
                            </td>
                            <td>
                                <span class="dashicons dashicons-calendar-alt" style="color:#64748b; font-size:14px; margin-top:2px;"></span> <?php echo esc_html($o->get_meta('ecb_date')); ?><br>
                                <strong style="color:#0f172a;"><span class="dashicons dashicons-clock" style="color:#64748b; font-size:14px; margin-top:2px;"></span> <?php echo esc_html($o->get_meta('ecb_time')); ?></strong><br>
                                <small style="color:#64748b; margin-top:4px; display:block;">Method: <strong><?php echo esc_html($o->get_payment_method_title() ?: 'N/A'); ?></strong></small>
                            </td>
                            <td>
                                <div style="display:flex; flex-direction:column; gap:5px;">
                                    <select class="ecb-status-select" onchange="ecbUpdateStatus(<?php echo $o->get_id(); ?>, this.value, this)">
                                        <?php
                                        $statuses = wc_get_order_statuses();
                                        foreach ($statuses as $key => $label):
                                            $clean_key = str_replace('wc-', '', $key);
                                            $selected = ($status === $clean_key) ? 'selected' : '';
                                        ?>
                                            <option value="<?php echo esc_attr($clean_key); ?>" <?php echo $selected; ?>><?php echo esc_html($label); ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                    <button class="btn-wa" style="width:100%; justify-content:center; background:#0ea5e9;" onclick="ecbSendReceiptWA('<?php echo esc_js($wa_num); ?>', '<?php echo esc_js($o->get_billing_first_name()); ?>', <?php echo $o->get_id(); ?>)">
                                        <span class="dashicons dashicons-media-document"></span> Send WA Receipt
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ==================== TAB: CALENDAR ==================== -->
        <div id="tab-cal" class="ecb-tab"><div id='calendar'></div></div>

        <!-- ==================== TAB: SERVICES & SLOTS ==================== -->
        <div id="tab-srv" class="ecb-tab" style="padding:0;">
            <div class="ecb-srv-layout">
                <div class="ecb-srv-sidebar">
                    <button class="ecb-srv-btn" style="color:#10b981; font-weight:bold;" onclick="ecbSwitchSrv(event, 'srv-add-new')">➕ Create New Service</button>
                    <?php foreach($services as $index => $s): ?>
                        <button class="ecb-srv-btn <?php echo $index===0?'active':''; ?>" onclick="ecbSwitchSrv(event, 'srv-<?php echo $s->ID; ?>')"><?php echo esc_html($s->post_title); ?></button>
                    <?php endforeach; ?>
                </div>

                <div class="ecb-srv-content">
                    <div id="srv-add-new" class="ecb-srv-pane">
                        <h2>➕ Create New Service</h2>
                        <form method="POST" style="background:#fff; padding:20px; border-radius:8px; border:1px solid #e2e8f0;">
                            <?php wp_nonce_field('ecb_save_srv'); ?>
                            <input type="hidden" name="action" value="add_new_service">
                            <div class="ecb-input-group"><label>Service Title</label><input type="text" name="new_title" required></div>
                            <div style="display:flex; gap:20px; flex-wrap:wrap;">
                                <div class="ecb-input-group" style="flex:1;"><label>Regular Price (SAR) *</label><input type="number" name="new_price" required placeholder="e.g. 500"></div>
                                <div class="ecb-input-group" style="flex:1;"><label>Sale Price (SAR) (Optional)</label><input type="number" name="new_sale_price" placeholder="e.g. 400"></div>
                            </div>
                            <div class="ecb-input-group"><label>Capacity (Orders per hour)</label><input type="number" name="new_cap" value="1" style="width:100px;"></div>
                            <div class="ecb-input-group">
                                <label>Default Daily Times <small style="font-weight:normal; color:#64748b;">(Comma separated. Example: 08:00 AM, 12:00 PM, 04:00 PM)</small></label>
                                <input type="text" name="new_times" value="08:00 AM, 10:00 AM, 01:00 PM, 04:00 PM" required>
                            </div>
                            <div class="ecb-input-group">
                                <label>Sub-Services (Optional)</label>
                                <div id="new-srv-subs-container" style="display:flex; flex-direction:column; gap:10px; margin-bottom:10px;"></div>
                                <button type="button" class="button" onclick="ecbAddSubServiceRow('new-srv')">+ Add Sub-Service Option</button>
                                <input type="hidden" name="new_sub" id="new-srv-subs-hidden">
                            </div>
                            <button type="submit" class="button button-primary">Create Service</button>
                        </form>
                    </div>

                    <?php foreach($services as $index => $s):
                        $srv_img_url = get_post_meta($s->ID, '_ecb_service_image', true);
                        $srv_desc = get_post_meta($s->ID, '_ecb_service_description', true);
                    ?>
                    <div id="srv-<?php echo $s->ID; ?>" class="ecb-srv-pane <?php echo $index===0?'active':''; ?>">
                        <h2>Settings: <?php echo esc_html($s->post_title); ?></h2>
                        <form method="POST" style="background:#fff; padding:20px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:20px;">
                            <?php wp_nonce_field('ecb_save_srv'); ?>
                            <input type="hidden" name="action" value="update_service_meta"><input type="hidden" name="service_id" value="<?php echo $s->ID; ?>">

                            <!-- NEW: Editable Service Title -->
                            <div class="ecb-input-group"><label>Service Title</label><input type="text" name="srv_title" value="<?php echo esc_attr($s->post_title); ?>"></div>

                            <!-- NEW: Service Description -->
                            <div class="ecb-input-group"><label>Service Description</label><textarea name="srv_desc" rows="3" placeholder="Brief description of this service..."><?php echo esc_textarea($srv_desc); ?></textarea></div>

                            <div style="display:flex; gap:20px; flex-wrap:wrap;">
                                <div class="ecb-input-group"><label>Regular Price (SAR) *</label><input type="number" name="reg_price" value="<?php echo esc_attr(get_post_meta($s->ID, '_regular_price', true)); ?>" required></div>
                                <div class="ecb-input-group"><label>Sale Price (SAR) (Optional)</label><input type="number" name="sale_price" value="<?php echo esc_attr(get_post_meta($s->ID, '_sale_price', true)); ?>"></div>
                                <div class="ecb-input-group"><label>Capacity (Orders/hr)</label><input type="number" name="cap" value="<?php echo esc_attr(get_post_meta($s->ID, '_csb_service_capacity', true)?:1); ?>" style="width:80px;"></div>
                            </div>
                            <div class="ecb-input-group">
                                <label>Sub-Services (Optional Options)</label>
                                <?php $current_subs = esc_textarea(get_post_meta($s->ID, '_ecb_sub_services', true)); ?>
                                <div id="edit-srv-<?php echo $s->ID; ?>-subs-container" style="display:flex; flex-direction:column; gap:10px; margin-bottom:10px;"></div>
                                <button type="button" class="button" onclick="ecbAddSubServiceRow('edit-srv-<?php echo $s->ID; ?>')">+ Add Sub-Service Option</button>
                                <input type="hidden" name="sub_services" id="edit-srv-<?php echo $s->ID; ?>-subs-hidden" value="<?php echo $current_subs; ?>">
                                <script> document.addEventListener('DOMContentLoaded', () => ecbLoadExistingSubs('edit-srv-<?php echo $s->ID; ?>', '<?php echo $current_subs; ?>')); </script>
                            </div>

                            <!-- ENHANCED: Service Image with Preview -->
                            <div class="ecb-input-group">
                                <label>Service Image</label>
                                <?php if($srv_img_url): ?>
                                    <img src="<?php echo esc_url($srv_img_url); ?>" class="ecb-srv-img-preview" id="img_preview_<?php echo $s->ID; ?>">
                                <?php else: ?>
                                    <img src="" class="ecb-srv-img-preview" id="img_preview_<?php echo $s->ID; ?>" style="display:none;">
                                <?php endif; ?>
                                <input type="text" id="img_url_<?php echo $s->ID; ?>" name="srv_img" value="<?php echo esc_attr($srv_img_url); ?>" onchange="document.getElementById('img_preview_<?php echo $s->ID; ?>').src=this.value; document.getElementById('img_preview_<?php echo $s->ID; ?>').style.display='block';">
                                <button type="button" class="button" style="margin-top:5px;" onclick="ecbOpenUploader('img_url_<?php echo $s->ID; ?>', 'img_preview_<?php echo $s->ID; ?>')">Upload Image</button>
                            </div>

                            <div class="ecb-input-group">
                                <label>Default Daily Times</label>
                                <input type="text" name="times" value="<?php echo esc_attr(get_post_meta($s->ID, '_csb_service_times', true)); ?>">
                            </div>
                            <button type="submit" class="button button-primary">Save Settings</button>
                        </form>

                        <h3>📅 Slot Manager (Overrides & Locking)</h3>
                        <input type="date" id="date-picker-<?php echo $s->ID; ?>" style="padding:8px; border:1px solid #cbd5e1; border-radius:4px;" onchange="ecbLoadAdminSlots(<?php echo $s->ID; ?>)">

                        <div style="background:#fff; border:1px solid #e2e8f0; padding:15px; border-radius:8px; margin-top:15px; display:flex; gap:10px; flex-wrap:wrap; align-items:flex-end;">
                            <div><label style="font-size:12px; font-weight:bold;">Add Single Time</label><br><input type="time" id="add-time-val-<?php echo $s->ID; ?>" style="padding:6px;"></div>
                            <div><button class="button" onclick="ecbAddCustomSlot(<?php echo $s->ID; ?>)">+ Add</button></div>
                            <div style="border-left: 2px dashed #cbd5e1; margin: 0 10px;"></div>
                            <div><label style="font-size:12px; font-weight:bold;">Bulk Start</label><br><input type="time" id="bulk-start-<?php echo $s->ID; ?>" style="padding:6px;"></div>
                            <div><label style="font-size:12px; font-weight:bold;">End</label><br><input type="time" id="bulk-end-<?php echo $s->ID; ?>" style="padding:6px;"></div>
                            <div><label style="font-size:12px; font-weight:bold;">Interval (Mins)</label><br><input type="number" id="bulk-interval-<?php echo $s->ID; ?>" value="60" style="padding:6px; width:60px;"></div>
                            <div><button class="button button-primary" onclick="ecbBulkGenerateSlots(<?php echo $s->ID; ?>)">Auto-Generate</button></div>
                        </div>
                        <div class="ecb-slot-grid" id="slot-grid-<?php echo $s->ID; ?>"><p style="color:#64748b;">Select a date to manage slots.</p></div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>

        <!-- ==================== TAB: TESTIMONIALS ==================== -->
        <div id="tab-testimonials" class="ecb-tab">
            <h2>⭐ Testimonials Management</h2>
            <p style="color:#64748b; margin-bottom:20px;">Manage customer testimonials that appear on your website.</p>

            <div class="ecb-add-form">
                <h3 style="margin-top:0;">➕ Add New Testimonial</h3>
                <form method="POST">
                    <?php wp_nonce_field('ecb_save_testimonials'); ?>
                    <input type="hidden" name="ecb_testimonial_action" value="add">
                    <div style="display:flex; gap:20px; flex-wrap:wrap;">
                        <div class="ecb-input-group" style="flex:1; min-width:200px;"><label>Customer Name</label><input type="text" name="tst_name" required placeholder="اسم العميل"></div>
                        <div class="ecb-input-group" style="width:120px;"><label>Rating (1-5)</label><input type="number" name="tst_rating" min="1" max="5" value="5" required></div>
                    </div>
                    <div class="ecb-input-group"><label>Testimonial Text</label><textarea name="tst_text" rows="3" required placeholder="نص التقييم..."></textarea></div>
                    <div class="ecb-input-group">
                        <label>Customer Photo URL (Optional)</label>
                        <input type="text" name="tst_image" id="tst_new_img" placeholder="https://...">
                        <button type="button" class="button" style="margin-top:5px;" onclick="ecbOpenUploader('tst_new_img')">Upload Photo</button>
                    </div>
                    <button type="submit" class="button button-primary">Add Testimonial</button>
                </form>
            </div>

            <div class="ecb-card-grid">
                <?php foreach($testimonials as $tst): ?>
                <div class="ecb-card" id="tst-card-<?php echo esc_attr($tst['id']); ?>">
                    <div style="display:flex; gap:15px; align-items:flex-start;">
                        <?php if(!empty($tst['image'])): ?>
                            <img src="<?php echo esc_url($tst['image']); ?>" class="ecb-card-img">
                        <?php else: ?>
                            <div class="ecb-card-img" style="display:flex; align-items:center; justify-content:center; background:#f1f5f9; font-size:24px;">👤</div>
                        <?php endif; ?>
                        <div style="flex:1;">
                            <strong style="font-size:16px; color:#0f172a;"><?php echo esc_html($tst['name']); ?></strong>
                            <div class="ecb-stars" style="margin:5px 0;">
                                <?php for($i=1; $i<=5; $i++) echo $i <= $tst['rating'] ? '★' : '☆'; ?>
                            </div>
                            <p style="color:#475569; font-size:14px; margin:5px 0; line-height:1.6;">"<?php echo esc_html($tst['text']); ?>"</p>
                        </div>
                    </div>
                    <div class="ecb-card-actions">
                        <button class="btn-edit" onclick="ecbEditTestimonial('<?php echo esc_js($tst['id']); ?>', '<?php echo esc_js($tst['name']); ?>', `<?php echo esc_js($tst['text']); ?>`, <?php echo intval($tst['rating']); ?>, '<?php echo esc_js($tst['image'] ?? ''); ?>')">✏️ Edit</button>
                        <form method="POST" style="display:inline;" onsubmit="return confirm('Delete this testimonial?');">
                            <?php wp_nonce_field('ecb_save_testimonials'); ?>
                            <input type="hidden" name="ecb_testimonial_action" value="delete">
                            <input type="hidden" name="tst_id" value="<?php echo esc_attr($tst['id']); ?>">
                            <button type="submit" class="btn-del">🗑️ Delete</button>
                        </form>
                    </div>
                </div>
                <?php endforeach; ?>
                <?php if(empty($testimonials)): ?>
                    <p style="color:#94a3b8; text-align:center; grid-column: 1/-1; padding:40px;">No testimonials yet. Add your first one above!</p>
                <?php endif; ?>
            </div>
        </div>

        <!-- ==================== TAB: PORTFOLIO ==================== -->
        <div id="tab-portfolio" class="ecb-tab">
            <h2>🖼️ Portfolio Management</h2>
            <p style="color:#64748b; margin-bottom:20px;">Manage your portfolio items with links and short previews.</p>

            <div class="ecb-add-form">
                <h3 style="margin-top:0;">➕ Add Portfolio Item</h3>
                <form method="POST">
                    <?php wp_nonce_field('ecb_save_portfolio'); ?>
                    <input type="hidden" name="ecb_portfolio_action" value="add">
                    <div class="ecb-input-group"><label>Title</label><input type="text" name="pf_title" required placeholder="Project name"></div>
                    <div class="ecb-input-group"><label>Link URL</label><input type="url" name="pf_link" required placeholder="https://example.com"></div>
                    <div class="ecb-input-group"><label>Short Description / Preview</label><textarea name="pf_description" rows="2" required placeholder="Brief description of this work..."></textarea></div>
                    <div class="ecb-input-group">
                        <label>Preview Image URL (Optional)</label>
                        <input type="text" name="pf_image" id="pf_new_img" placeholder="https://...">
                        <button type="button" class="button" style="margin-top:5px;" onclick="ecbOpenUploader('pf_new_img')">Upload Image</button>
                    </div>
                    <button type="submit" class="button button-primary">Add Portfolio Item</button>
                </form>
            </div>

            <div class="ecb-card-grid">
                <?php foreach($portfolio as $pf): ?>
                <div class="ecb-card">
                    <div class="ecb-pf-preview">
                        <?php if(!empty($pf['image'])): ?>
                            <img src="<?php echo esc_url($pf['image']); ?>">
                        <?php else: ?>
                            <div style="width:120px; height:80px; background:#f1f5f9; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:28px; border:1px solid #e2e8f0;">🖼️</div>
                        <?php endif; ?>
                        <div class="pf-info">
                            <h4><?php echo esc_html($pf['title']); ?></h4>
                            <p><?php echo esc_html($pf['description']); ?></p>
                            <a href="<?php echo esc_url($pf['link']); ?>" target="_blank">🔗 <?php echo esc_html($pf['link']); ?></a>
                        </div>
                    </div>
                    <div class="ecb-card-actions">
                        <button class="btn-edit" onclick="ecbEditPortfolio('<?php echo esc_js($pf['id']); ?>', '<?php echo esc_js($pf['title']); ?>', '<?php echo esc_js($pf['link']); ?>', `<?php echo esc_js($pf['description']); ?>`, '<?php echo esc_js($pf['image'] ?? ''); ?>')">✏️ Edit</button>
                        <form method="POST" style="display:inline;" onsubmit="return confirm('Delete this portfolio item?');">
                            <?php wp_nonce_field('ecb_save_portfolio'); ?>
                            <input type="hidden" name="ecb_portfolio_action" value="delete">
                            <input type="hidden" name="pf_id" value="<?php echo esc_attr($pf['id']); ?>">
                            <button type="submit" class="btn-del">🗑️ Delete</button>
                        </form>
                    </div>
                </div>
                <?php endforeach; ?>
                <?php if(empty($portfolio)): ?>
                    <p style="color:#94a3b8; text-align:center; grid-column: 1/-1; padding:40px;">No portfolio items yet. Add your first one above!</p>
                <?php endif; ?>
            </div>
        </div>

        <!-- ==================== TAB: PLANS & PRICING ==================== -->
        <div id="tab-plans" class="ecb-tab">
            <h2>💰 Plans & Pricing Management</h2>
            <p style="color:#64748b; margin-bottom:20px;">Manage your service plans and pricing details.</p>

            <div class="ecb-add-form">
                <h3 style="margin-top:0;">➕ Add New Plan</h3>
                <form method="POST">
                    <?php wp_nonce_field('ecb_save_plans'); ?>
                    <input type="hidden" name="ecb_plans_action" value="add">
                    <div style="display:flex; gap:20px; flex-wrap:wrap;">
                        <div class="ecb-input-group" style="flex:2; min-width:200px;"><label>Plan Name</label><input type="text" name="plan_name" required placeholder="e.g. Basic, Premium, VIP"></div>
                        <div class="ecb-input-group" style="flex:1; min-width:120px;"><label>Price (SAR)</label><input type="text" name="plan_price" required placeholder="e.g. 299"></div>
                        <div class="ecb-input-group" style="flex:1; min-width:120px;"><label>Period</label><input type="text" name="plan_period" placeholder="e.g. /month, /visit" value="/month"></div>
                    </div>
                    <div class="ecb-input-group"><label>Features <small style="font-weight:normal; color:#64748b;">(One feature per line)</small></label><textarea name="plan_features" rows="4" required placeholder="Feature 1&#10;Feature 2&#10;Feature 3"></textarea></div>
                    <div class="ecb-input-group"><label><input type="checkbox" name="plan_popular" value="1"> Mark as Popular / Recommended</label></div>
                    <button type="submit" class="button button-primary">Add Plan</button>
                </form>
            </div>

            <div class="ecb-card-grid">
                <?php foreach($plans as $plan): ?>
                <div class="ecb-card ecb-plan-card <?php echo $plan['is_popular'] ? 'popular' : ''; ?>">
                    <?php if($plan['is_popular']): ?>
                        <span style="position:absolute; top:10px; right:10px; background:#f59e0b; color:#fff; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700;">⭐ Popular</span>
                    <?php endif; ?>
                    <h3 style="margin:0 0 5px; color:#0f172a; font-size:18px;"><?php echo esc_html($plan['name']); ?></h3>
                    <div>
                        <span class="ecb-plan-price"><?php echo esc_html($plan['price']); ?> SAR</span>
                        <span class="ecb-plan-period"><?php echo esc_html($plan['period']); ?></span>
                    </div>
                    <ul class="ecb-plan-features">
                        <?php
                        $features = explode("\n", $plan['features']);
                        foreach($features as $f):
                            $f = trim($f);
                            if(!empty($f)):
                        ?>
                            <li><?php echo esc_html($f); ?></li>
                        <?php endif; endforeach; ?>
                    </ul>
                    <div class="ecb-card-actions">
                        <button class="btn-edit" onclick="ecbEditPlan('<?php echo esc_js($plan['id']); ?>', '<?php echo esc_js($plan['name']); ?>', '<?php echo esc_js($plan['price']); ?>', '<?php echo esc_js($plan['period']); ?>', `<?php echo esc_js($plan['features']); ?>`, <?php echo $plan['is_popular'] ? 'true' : 'false'; ?>)">✏️ Edit</button>
                        <form method="POST" style="display:inline;" onsubmit="return confirm('Delete this plan?');">
                            <?php wp_nonce_field('ecb_save_plans'); ?>
                            <input type="hidden" name="ecb_plans_action" value="delete">
                            <input type="hidden" name="plan_id" value="<?php echo esc_attr($plan['id']); ?>">
                            <button type="submit" class="btn-del">🗑️ Delete</button>
                        </form>
                    </div>
                </div>
                <?php endforeach; ?>
                <?php if(empty($plans)): ?>
                    <p style="color:#94a3b8; text-align:center; grid-column: 1/-1; padding:40px;">No plans yet. Add your first plan above!</p>
                <?php endif; ?>
            </div>
        </div>

        <!-- ==================== TAB: CRM ==================== -->
        <div id="tab-crm" class="ecb-tab">
            <h2>💎 VIP Clients & Dynamic Loyalty</h2>
            <div style="display:flex; gap:15px; margin-bottom:20px; flex-wrap:wrap;">
                <?php foreach($top_suggestions as $phone => $data): ?>
                <div style="background:#fef3c7; border:1px solid #fde68a; padding:15px; border-radius:8px; flex:1; border-left:4px solid #f59e0b;">
                    <h4 style="margin:0 0 5px 0; color:#92400e;"><?php echo esc_html($data['name']); ?> (<?php echo esc_html($phone); ?>)</h4>
                    <p style="margin:0; font-size:13px; color:#b45309;">Spend: <?php echo wc_price($data['spend']); ?> | Bookings: <?php echo $data['bookings']; ?></p>
                </div>
                <?php endforeach; ?>
            </div>

            <input type="text" id="crmSearch" onkeyup="ecbSearchCRM()" placeholder="🔍 Search Phone or Name..." style="width: 100%; max-width: 400px; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 20px;">
            <table class="ecb-table" id="crmTable">
                <thead><tr><th>VIP Tier</th><th>Client Details</th><th>Bookings</th><th>Total Spend</th><th>Generate & Send Loyalty Coupon (WA)</th></tr></thead>
                <tbody>
                <?php $idx=0; foreach($clients as $phone => $data): $idx++;
                    $tier = 'Bronze'; $t_color = '#cd7f32';
                    if($data['spend'] > 1000) { $tier = 'Silver'; $t_color = '#94a3b8'; }
                    if($data['spend'] > 5000) { $tier = 'Gold'; $t_color = '#eab308'; }
                    if($data['spend'] > 10000) { $tier = 'VIP Platinum'; $t_color = '#8b5cf6'; }
                ?>
                    <tr>
                        <td><span style="background:<?php echo $t_color; ?>15; color:<?php echo $t_color; ?>; padding:6px 10px; border-radius:30px; font-weight:700; font-size:12px; border: 1px solid <?php echo $t_color; ?>40;"><span class="dashicons dashicons-star-filled" style="font-size:14px; margin-top:2px;"></span> <?php echo $tier; ?></span></td>
                        <td><strong><?php echo esc_html($data['name']); ?></strong><br><small style="color:#64748b; font-size:13px;"><?php echo esc_html($phone); ?></small></td>
                        <td><span style="font-size:18px; font-weight:800; color:#0f172a;"><?php echo $data['bookings']; ?></span><br><small style="color:#64748b;">Orders</small></td>
                        <td><span style="font-size:18px; font-weight:800; color:#10b981;"><?php echo wc_price($data['spend']); ?></span></td>
                        <td>
                            <div style="display:flex; gap:8px; align-items:center;">
                                <input type="number" id="loyalty_amt_<?php echo $idx; ?>" value="15" style="width:70px; padding:8px; border:1px solid #cbd5e1; border-radius:6px;">
                                <select id="loyalty_type_<?php echo $idx; ?>" style="padding:8px; border-radius:6px; border:1px solid #cbd5e1;">
                                    <option value="percent">% Off</option>
                                    <option value="fixed_cart">SAR Off</option>
                                </select>
                                <button class="btn-wa" onclick="ecbSendLoyaltyWA('<?php echo esc_js($phone); ?>', '<?php echo esc_js($data['name']); ?>', <?php echo $idx; ?>, this)"><span class="dashicons dashicons-whatsapp"></span> Create & Send</button>
                            </div>
                        </td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- MODALS -->
    <div id="ecbOrderModal" class="ecb-modal-overlay">
        <div class="ecb-modal-box">
            <button style="position:absolute; top:15px; right:20px; border:none; background:none; font-size:24px; cursor:pointer;" onclick="document.getElementById('ecbOrderModal').style.display='none'">×</button>
            <div id="ecbModalContent">Loading...</div>
        </div>
    </div>

    <!-- EDIT MODALS -->
    <div id="ecbEditModal" class="ecb-modal-overlay">
        <div class="ecb-modal-box" style="max-width:700px;">
            <button style="position:absolute; top:15px; right:20px; border:none; background:none; font-size:24px; cursor:pointer;" onclick="document.getElementById('ecbEditModal').style.display='none'">×</button>
            <div id="ecbEditModalContent"></div>
        </div>
    </div>

    <script>
        const adminAjaxUrl = '<?php echo esc_url(admin_url('admin-ajax.php')); ?>';
        const adminNonce = '<?php echo esc_js(wp_create_nonce('ecb_admin_secure_nonce')); ?>';
        let calendar;

        function ecbSwitchTab(evt, tabId) { document.querySelectorAll('.ecb-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.ecb-nav-item').forEach(b => b.classList.remove('active')); document.getElementById(tabId).classList.add('active'); evt.currentTarget.classList.add('active'); }
        function ecbSwitchSrv(evt, paneId) { document.querySelectorAll('.ecb-srv-pane').forEach(p => p.classList.remove('active')); document.querySelectorAll('.ecb-srv-btn').forEach(b => b.classList.remove('active')); document.getElementById(paneId).classList.add('active'); evt.currentTarget.classList.add('active'); }

        document.addEventListener('DOMContentLoaded', function() {
            let calendarEl = document.getElementById('calendar');
            calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth', events: <?php echo json_encode($calendar_events); ?>,
                eventClick: function(info) {
                    info.jsEvent.preventDefault(); let d = info.event.extendedProps.date; let orders = JSON.parse(info.event.extendedProps.orders);
                    let html = `<h2>Orders on ${d}</h2><table class="ecb-table"><thead><tr><th>ID/Status</th><th>Time</th><th>Customer</th><th>Service</th></tr></thead><tbody>`;
                    orders.forEach(o => { html += `<tr><td><a href="#" onclick="ecbOpenOrderModal(${o.id})">#${o.id}</a><br><small>${o.status}</small></td><td>${o.time}</td><td>${o.name} (${o.phone})</td><td>${o.srv}</td></tr>`; });
                    html += `</tbody></table>`; document.getElementById('ecbModalContent').innerHTML = html; document.getElementById('ecbOrderModal').style.display = 'flex';
                }
            });
        });

        function ecbSendLoyaltyWA(phone, name, idx, btnEl) {
            let amt = document.getElementById('loyalty_amt_' + idx).value;
            let type = document.getElementById('loyalty_type_' + idx).value;
            let ogText = btnEl.innerText; btnEl.innerText = 'Wait...';

            jQuery.post(adminAjaxUrl, { action: 'ecb_generate_wa_coupon', amt: amt, type: type, security: adminNonce }, function(res) {
                btnEl.innerText = ogText;
                if(res.success) {
                    let wa_num = '966' + phone.replace(/^0+/, '');
                    let symbol = type === 'percent' ? '%' : ' ريال';
                    let text = `مرحباً ${name}! 🎁\nتقديراً لولائك، نهديك خصم بقيمة ${amt}${symbol} لزيارتك القادمة.\n\nكود الخصم الخاص بك هو:\n*${res.data}*\n\nننتظرك قريباً!`;
                    window.open(`https://wa.me/${wa_num}?text=${encodeURIComponent(text)}`, '_blank');
                } else { alert("Error generating coupon."); }
            });
        }

        function ecbUpdateStatus(orderId, status, selectEl) {
            let ogColor = selectEl.style.borderColor;
            selectEl.disabled = true;
            selectEl.style.borderColor = '#f59e0b';
            jQuery.post(adminAjaxUrl, { action: 'ecb_admin_update_order_status', order_id: orderId, status: status, security: adminNonce }, function(res) {
                selectEl.disabled = false;
                if(res.success) {
                    selectEl.style.borderColor = '#10b981';
                    setTimeout(() => { selectEl.style.borderColor = ogColor; location.reload(); }, 500);
                } else {
                    alert('Error: ' + res.data);
                    selectEl.style.borderColor = '#ef4444';
                }
            });
        }

        function ecbSendReceiptWA(waNum, name, orderId) {
            jQuery.post(adminAjaxUrl, { action: 'ecb_admin_get_receipt_text', order_id: orderId, security: adminNonce }, function(res) {
                if(res.success) {
                    let text = res.data;
                    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(text)}`, '_blank');
                } else {
                    alert('Could not fetch receipt details.');
                }
            });
        }

        function ecbOpenOrderModal(orderId) {
            document.getElementById('ecbModalContent').innerHTML = 'Loading...'; document.getElementById('ecbOrderModal').style.display = 'flex';
            jQuery.post(adminAjaxUrl, { action: 'ecb_admin_get_order_details', order_id: orderId, security: adminNonce }, function(res) {
                if(res.success) document.getElementById('ecbModalContent').innerHTML = res.data; else document.getElementById('ecbModalContent').innerHTML = '<p color="red">Error</p>';
            });
        }

        let ecbMediaUploader;
        function ecbOpenUploader(inputId, previewId) {
            ecbMediaUploader = wp.media({ title: 'Select Image', button: { text: 'Use this image' }, multiple: false });
            ecbMediaUploader.on('select', function() {
                let a = ecbMediaUploader.state().get('selection').first().toJSON();
                document.getElementById(inputId).value = a.url;
                if(previewId) {
                    let prev = document.getElementById(previewId);
                    if(prev) { prev.src = a.url; prev.style.display = 'block'; }
                }
            });
            ecbMediaUploader.open();
        }

        function formatAMPM(time24) { let parts = time24.split(':'); let h = parseInt(parts[0]); let m = parts[1]; let ampm = h >= 12 ? 'PM' : 'AM'; h = h % 12; h = h ? h : 12; return (h < 10 ? '0'+h : h) + ':' + m + ' ' + ampm; }
        function ecbAddCustomSlot(pid) {
            let date = document.getElementById('date-picker-' + pid).value; let timeVal = document.getElementById('add-time-val-' + pid).value;
            if(!date || !timeVal) return alert("Select date and time.");
            jQuery.post(adminAjaxUrl, { action: 'ecb_admin_modify_custom_slot', pid: pid, date: date, time: formatAMPM(timeVal), type: 'add', security: adminNonce }, function(res) { if(res.success) ecbLoadAdminSlots(pid); });
        }
        function ecbBulkGenerateSlots(pid) {
            let date = document.getElementById('date-picker-' + pid).value; let start = document.getElementById('bulk-start-' + pid).value; let end = document.getElementById('bulk-end-' + pid).value; let interval = document.getElementById('bulk-interval-' + pid).value;
            if(!date || !start || !end || !interval) return alert("Fill all fields.");
            jQuery.post(adminAjaxUrl, { action: 'ecb_admin_bulk_generate', pid: pid, date: date, start: start, end: end, interval: interval, security: adminNonce }, function(res) { if(res.success) ecbLoadAdminSlots(pid); });
        }
        function ecbDeleteCustomSlot(pid, date, time) {
            if(!confirm('Remove ' + time + '?')) return;
            jQuery.post(adminAjaxUrl, { action: 'ecb_admin_modify_custom_slot', pid: pid, date: date, time: time, type: 'delete', security: adminNonce }, function(res) { if(res.success) ecbLoadAdminSlots(pid); });
        }
        function ecbLoadAdminSlots(pid) {
            let date = document.getElementById('date-picker-' + pid).value; if(!date) return;
            let grid = document.getElementById('slot-grid-' + pid); grid.innerHTML = '<p>Loading...</p>';
            jQuery.post(adminAjaxUrl, { action: 'ecb_admin_get_slots', pid: pid, date: date, security: adminNonce }, function(res) {
                if(res.success) {
                    grid.innerHTML = ''; if(res.data.length === 0) grid.innerHTML = '<p style="color:red;">No slots found.</p>';
                    res.data.forEach(slot => {
                        let div = document.createElement('div');
                        if(slot.status === 'booked') {
                            div.className = 'ecb-slot booked';
                            div.innerHTML = `<strong>${slot.time}</strong><br><span style="color:#3b82f6; font-size:12px;">Booked: ${slot.customer}</span><button class="btn-action btn-book" onclick="ecbOpenOrderModal(${slot.order_id})">View Order</button><button class="btn-action btn-unlock" onclick="if(confirm('Cancel Order & Free Slot?')) ecbAdminCancelOrder(${slot.order_id}, ${pid})">Free Up Slot</button>`;
                        } else if(slot.status === 'locked') {
                            div.className = 'ecb-slot locked';
                            div.innerHTML = `<strong>${slot.time}</strong><br><span style="color:#ef4444; font-size:12px;">Manually Closed</span><button class="btn-action btn-unlock" onclick="ecbToggleAdminSlot(${pid}, '${date}', '${slot.time}', 'unlock')">Open Slot</button><button class="btn-action btn-delete" onclick="ecbDeleteCustomSlot(${pid}, '${date}', '${slot.time}')">Remove Slot</button>`;
                        } else {
                            div.className = 'ecb-slot';
                            div.innerHTML = `<strong>${slot.time}</strong><br><span style="color:#10b981; font-size:12px;">Available</span><button class="btn-action btn-lock" onclick="ecbToggleAdminSlot(${pid}, '${date}', '${slot.time}', 'lock')">Close Slot</button><button class="btn-action btn-book" onclick="ecbManualBookSlot(${pid}, '${date}', '${slot.time}')">Quick Book</button><button class="btn-action btn-delete" onclick="ecbDeleteCustomSlot(${pid}, '${date}', '${slot.time}')">Remove Slot</button>`;
                        }
                        grid.appendChild(div);
                    });
                }
            });
        }
        function ecbToggleAdminSlot(pid, date, time, action_type) { jQuery.post(adminAjaxUrl, { action: 'ecb_admin_toggle_slot', pid: pid, date: date, time: time, type: action_type, security: adminNonce }, function(res) { if(res.success) ecbLoadAdminSlots(pid); }); }
        function ecbManualBookSlot(pid, date, time) { let name = prompt("Enter Customer Name:"); if(!name) return; let phone = prompt("Enter Customer Phone:"); jQuery.post(adminAjaxUrl, { action: 'ecb_admin_manual_book', pid: pid, date: date, time: time, name: name, phone: phone, security: adminNonce }, function(res) { if(res.success) ecbLoadAdminSlots(pid); }); }
        function ecbAdminCancelOrder(order_id, pid) { jQuery.post(adminAjaxUrl, { action: 'ecb_admin_cancel_order', order_id: order_id, security: adminNonce }, function(res) { if(res.success) ecbLoadAdminSlots(pid); }); }

        function ecbSearchCRM() {
            let filter = document.getElementById("crmSearch").value.toUpperCase(); let tr = document.getElementById("crmTable").getElementsByTagName("tr");
            for (let i = 1; i < tr.length; i++) { let td = tr[i].getElementsByTagName("td")[1]; if (td) { tr[i].style.display = (td.textContent || td.innerText).toUpperCase().indexOf(filter) > -1 ? "" : "none"; } }
        }

        // ===== SUB-SERVICE MANAGEMENT =====
        function ecbAddSubServiceRow(formPrefix, name = '', regPrice = '', salePrice = '') {
            const container = document.getElementById(formPrefix + '-subs-container');
            const row = document.createElement('div');
            row.style.display = 'flex'; row.style.gap = '10px'; row.className = 'ecb-sub-row';
            row.innerHTML = `
                <input type="text" placeholder="Option Name (e.g., Villa)" value="${name}" style="flex:2; padding:8px; border:1px solid #cbd5e1; border-radius:4px;" class="sub-name" onchange="ecbCompileSubs('${formPrefix}')">
                <input type="number" placeholder="Regular Price" value="${regPrice}" style="flex:1; padding:8px; border:1px solid #cbd5e1; border-radius:4px;" class="sub-price" onchange="ecbCompileSubs('${formPrefix}')">
                <input type="number" placeholder="Sale Price (Opt)" value="${salePrice}" style="flex:1; padding:8px; border:1px solid #cbd5e1; border-radius:4px;" class="sub-sale" onchange="ecbCompileSubs('${formPrefix}')">
                <button type="button" class="button" style="color:#ef4444; border-color:#fca5a5;" onclick="this.parentElement.remove(); ecbCompileSubs('${formPrefix}')">X</button>
            `;
            container.appendChild(row);
        }

        function ecbLoadExistingSubs(formPrefix, rawString) {
            if(!rawString) return;
            const txt = document.createElement("textarea"); txt.innerHTML = rawString; rawString = txt.value;
            const subs = rawString.split('|');
            subs.forEach(sub => {
                const parts = sub.split(':');
                if(parts.length >= 2) { ecbAddSubServiceRow(formPrefix, parts[0].trim(), parts[1].trim(), parts[2] ? parts[2].trim() : ''); }
            });
        }

        function ecbCompileSubs(formPrefix) {
            const container = document.getElementById(formPrefix + '-subs-container');
            const rows = container.querySelectorAll('.ecb-sub-row');
            let compiledArray = [];
            rows.forEach(row => {
                const name = row.querySelector('.sub-name').value.trim();
                const price = row.querySelector('.sub-price').value.trim();
                const sale = row.querySelector('.sub-sale').value.trim();
                if(name && price !== '') {
                    const safeName = name.replace(/[:|]/g, '');
                    let compiled = safeName + ':' + price;
                    if(sale !== '') compiled += ':' + sale;
                    compiledArray.push(compiled);
                }
            });
            document.getElementById(formPrefix + '-subs-hidden').value = compiledArray.join('|');
        }

        // ===== EDIT TESTIMONIAL =====
        function ecbEditTestimonial(id, name, text, rating, image) {
            document.getElementById('ecbEditModalContent').innerHTML = `
                <h2>Edit Testimonial</h2>
                <form method="POST">
                    <?php wp_nonce_field('ecb_save_testimonials'); ?>
                    <input type="hidden" name="ecb_testimonial_action" value="update">
                    <input type="hidden" name="tst_id" value="${id}">
                    <div class="ecb-input-group"><label>Customer Name</label><input type="text" name="tst_name" value="${name}" required></div>
                    <div class="ecb-input-group"><label>Rating (1-5)</label><input type="number" name="tst_rating" min="1" max="5" value="${rating}" required></div>
                    <div class="ecb-input-group"><label>Testimonial Text</label><textarea name="tst_text" rows="3" required>${text}</textarea></div>
                    <div class="ecb-input-group"><label>Customer Photo URL</label><input type="text" name="tst_image" value="${image}" id="tst_edit_img"><button type="button" class="button" style="margin-top:5px;" onclick="ecbOpenUploader('tst_edit_img')">Upload</button></div>
                    <button type="submit" class="button button-primary">Save Changes</button>
                </form>`;
            document.getElementById('ecbEditModal').style.display = 'flex';
        }

        // ===== EDIT PORTFOLIO =====
        function ecbEditPortfolio(id, title, link, description, image) {
            document.getElementById('ecbEditModalContent').innerHTML = `
                <h2>Edit Portfolio Item</h2>
                <form method="POST">
                    <?php wp_nonce_field('ecb_save_portfolio'); ?>
                    <input type="hidden" name="ecb_portfolio_action" value="update">
                    <input type="hidden" name="pf_id" value="${id}">
                    <div class="ecb-input-group"><label>Title</label><input type="text" name="pf_title" value="${title}" required></div>
                    <div class="ecb-input-group"><label>Link URL</label><input type="url" name="pf_link" value="${link}" required></div>
                    <div class="ecb-input-group"><label>Short Description</label><textarea name="pf_description" rows="2" required>${description}</textarea></div>
                    <div class="ecb-input-group"><label>Preview Image URL</label><input type="text" name="pf_image" value="${image}" id="pf_edit_img"><button type="button" class="button" style="margin-top:5px;" onclick="ecbOpenUploader('pf_edit_img')">Upload</button></div>
                    <button type="submit" class="button button-primary">Save Changes</button>
                </form>`;
            document.getElementById('ecbEditModal').style.display = 'flex';
        }

        // ===== EDIT PLAN =====
        function ecbEditPlan(id, name, price, period, features, isPopular) {
            document.getElementById('ecbEditModalContent').innerHTML = `
                <h2>Edit Plan</h2>
                <form method="POST">
                    <?php wp_nonce_field('ecb_save_plans'); ?>
                    <input type="hidden" name="ecb_plans_action" value="update">
                    <input type="hidden" name="plan_id" value="${id}">
                    <div class="ecb-input-group"><label>Plan Name</label><input type="text" name="plan_name" value="${name}" required></div>
                    <div style="display:flex; gap:20px;">
                        <div class="ecb-input-group" style="flex:1;"><label>Price (SAR)</label><input type="text" name="plan_price" value="${price}" required></div>
                        <div class="ecb-input-group" style="flex:1;"><label>Period</label><input type="text" name="plan_period" value="${period}"></div>
                    </div>
                    <div class="ecb-input-group"><label>Features (one per line)</label><textarea name="plan_features" rows="4" required>${features}</textarea></div>
                    <div class="ecb-input-group"><label><input type="checkbox" name="plan_popular" value="1" ${isPopular ? 'checked' : ''}> Mark as Popular</label></div>
                    <button type="submit" class="button button-primary">Save Changes</button>
                </form>`;
            document.getElementById('ecbEditModal').style.display = 'flex';
        }
    </script>
    <?php
}

/* ============================================================================
* 5. ADMIN AJAX ENDPOINTS
* ============================================================================ */
add_action('wp_ajax_ecb_generate_wa_coupon', 'ecb_generate_wa_coupon');
function ecb_generate_wa_coupon() {
    check_ajax_referer('ecb_admin_secure_nonce', 'security'); if (!current_user_can('manage_options')) wp_send_json_error();
    $amt = floatval($_POST['amt']); $type = sanitize_text_field($_POST['type']);
    $coupon_code = 'VIP-' . strtoupper(substr(md5(uniqid()), 0, 6));

    $coupon = new WC_Coupon();
    $coupon->set_code($coupon_code); $coupon->set_discount_type($type); $coupon->set_amount($amt); $coupon->set_individual_use(true); $coupon->set_usage_limit(1); $coupon->save();

    wp_send_json_success($coupon_code);
}

add_action('wp_ajax_ecb_admin_update_order_status', 'ecb_admin_update_order_status');
function ecb_admin_update_order_status() {
    check_ajax_referer('ecb_admin_secure_nonce', 'security'); if (!current_user_can('manage_options')) wp_send_json_error('Unauthorized');
    $o = wc_get_order(intval($_POST['order_id']));
    if($o) { $o->update_status(sanitize_text_field($_POST['status']), 'Updated via V2 CRM.'); wp_send_json_success('Updated'); }
    wp_send_json_error('Order failed to update.');
}

add_action('wp_ajax_ecb_admin_get_order_details', 'ecb_admin_get_order_details');
function ecb_admin_get_order_details() {
    check_ajax_referer('ecb_admin_secure_nonce', 'security'); if (!current_user_can('manage_options')) wp_send_json_error();
    $o = wc_get_order(intval($_POST['order_id'])); if(!$o) wp_send_json_error('Not found.');
    $items = ''; foreach($o->get_items() as $i) { $items .= esc_html($i->get_name()) . " (x" . $i->get_quantity() . ")<br>"; }
    $html = "<h2>Order #{$o->get_id()} Status: {$o->get_status()}</h2>
    <div style='background:#f8fafc; padding:20px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:15px;'>
        <p><strong>Customer:</strong> " . esc_html($o->get_billing_first_name()) . " | " . esc_html($o->get_billing_phone()) . "</p>
        <p><strong>Address:</strong> " . esc_html($o->get_billing_address_1()) . "</p>
        <p><strong>Service:</strong> {$items}</p>
        <p><strong>Time:</strong> " . esc_html($o->get_meta('ecb_date')) . " at " . esc_html($o->get_meta('ecb_time')) . "</p>
        <p><strong>Total:</strong> " . wc_price($o->get_total()) . "</p>
    </div>";
    wp_send_json_success($html);
}

add_action('wp_ajax_ecb_admin_get_receipt_text', 'ecb_admin_get_receipt_text');
function ecb_admin_get_receipt_text() {
    check_ajax_referer('ecb_admin_secure_nonce', 'security'); if (!current_user_can('manage_options')) wp_send_json_error();
    $o = wc_get_order(intval($_POST['order_id'])); if(!$o) wp_send_json_error('Not found.');

    $items_text = '';
    foreach($o->get_items() as $i) {
        $items_text .= "- " . $i->get_name() . "\n";
        if($i->get_meta('نوع الخدمة')) {
            $items_text .= "  (" . $i->get_meta('نوع الخدمة') . ")\n";
        }
    }

    $total = wp_strip_all_tags(wc_price($o->get_total()));
    $date = $o->get_meta('ecb_date');
    $time = $o->get_meta('ecb_time');

    $text = "مرحباً " . $o->get_billing_first_name() . " 📄\n\n";
    $text .= "تم استلام طلبكم بنجاح عبر Engaz Care.\n";
    $text .= "رقم الطلب: #" . $o->get_id() . "\n\n";
    $text .= "تفاصيل الحجز:\n";
    $text .= $items_text . "\n";
    $text .= "الموعد: $date في $time\n";
    $text .= "الإجمالي: $total\n\n";
    $text .= "شكراً لثقتكم بنا! نتطلع لخدمتكم قريباً. 💙";

    wp_send_json_success($text);
}

add_action('wp_ajax_ecb_admin_bulk_generate', 'ecb_admin_bulk_generate');
function ecb_admin_bulk_generate() {
    check_ajax_referer('ecb_admin_secure_nonce', 'security'); if (!current_user_can('manage_options')) wp_send_json_error();
    $pid = intval($_POST['pid']); $date = sanitize_text_field($_POST['date']); $start = sanitize_text_field($_POST['start']); $end = sanitize_text_field($_POST['end']); $interval = intval($_POST['interval']);
    $start_time = strtotime("$date $start"); $end_time = strtotime("$date $end"); $times = [];
    for($i = $start_time; $i <= $end_time; $i += ($interval * 60)) { $times[] = date('h:i A', $i); }
    update_post_meta($pid, "_ecb_slots_{$date}", wp_json_encode($times)); wp_send_json_success();
}

add_action('wp_ajax_ecb_admin_modify_custom_slot', 'ecb_admin_modify_custom_slot');
function ecb_admin_modify_custom_slot() {
    check_ajax_referer('ecb_admin_secure_nonce', 'security'); if (!current_user_can('manage_options')) wp_send_json_error();
    $pid = intval($_POST['pid']); $date = sanitize_text_field($_POST['date']); $time = sanitize_text_field($_POST['time']); $type = sanitize_text_field($_POST['type']);
    $custom_slots_json = get_post_meta($pid, "_ecb_slots_{$date}", true);
    $times = $custom_slots_json ? json_decode($custom_slots_json, true) : array_map('trim', explode(',', get_post_meta($pid, '_csb_service_times', true) ?: '08:00 AM'));
    if($type === 'add' && !in_array($time, $times)) { $times[] = $time; } else if($type === 'delete' && ($key = array_search($time, $times)) !== false) { unset($times[$key]); }
    usort($times, function($a, $b) { return strtotime($a) - strtotime($b); });
    update_post_meta($pid, "_ecb_slots_{$date}", wp_json_encode(array_values($times))); wp_send_json_success();
}

add_action('wp_ajax_ecb_admin_get_slots', 'ecb_admin_get_slots');
function ecb_admin_get_slots() {
    check_ajax_referer('ecb_admin_secure_nonce', 'security'); if (!current_user_can('manage_options')) wp_send_json_error();
    $pid = intval($_POST['pid']); $date = sanitize_text_field($_POST['date']);
    $custom_slots_json = get_post_meta($pid, "_ecb_slots_{$date}", true);
    $times = $custom_slots_json ? json_decode($custom_slots_json, true) : array_map('trim', explode(',', get_post_meta($pid, '_csb_service_times', true) ?: '08:00 AM'));
    $orders = wc_get_orders(array('limit' => -1, 'status' => array('wc-processing', 'wc-completed', 'wc-pending'), 'meta_query' => array('relation' => 'AND', array('key' => 'ecb_date', 'value' => $date), array('key' => 'ecb_product_id', 'value' => $pid))));
    $booked_times = array(); foreach($orders as $o) { $booked_times[$o->get_meta('ecb_time')] = array('id' => $o->get_id(), 'name' => $o->get_billing_first_name()); }
    $result = [];
    foreach($times as $t) {
        $is_locked = get_post_meta($pid, "_ecb_lock_{$date}_{$t}", true) === 'yes';
        if(isset($booked_times[$t])) { $result[] = ['time' => $t, 'status' => 'booked', 'order_id' => $booked_times[$t]['id'], 'customer' => $booked_times[$t]['name']]; }
        elseif($is_locked) { $result[] = ['time' => $t, 'status' => 'locked']; } else { $result[] = ['time' => $t, 'status' => 'free']; }
    }
    wp_send_json_success($result);
}

add_action('wp_ajax_ecb_admin_toggle_slot', 'ecb_admin_toggle_slot');
function ecb_admin_toggle_slot() {
    check_ajax_referer('ecb_admin_secure_nonce', 'security'); if (!current_user_can('manage_options')) wp_send_json_error();
    $pid = intval($_POST['pid']); $date = sanitize_text_field($_POST['date']); $time = sanitize_text_field($_POST['time']); $type = sanitize_text_field($_POST['type']);
    if($type === 'lock') update_post_meta($pid, "_ecb_lock_{$date}_{$time}", 'yes'); else delete_post_meta($pid, "_ecb_lock_{$date}_{$time}");
    wp_send_json_success();
}

add_action('wp_ajax_ecb_admin_manual_book', 'ecb_admin_manual_book');
function ecb_admin_manual_book() {
    check_ajax_referer('ecb_admin_secure_nonce', 'security'); if (!current_user_can('manage_options')) wp_send_json_error();
    $pid = intval($_POST['pid']); $date = sanitize_text_field($_POST['date']); $time = sanitize_text_field($_POST['time']);
    $order = wc_create_order(); $order->add_product(wc_get_product($pid), 1);
    $order->set_billing_first_name(sanitize_text_field($_POST['name'])); $order->set_billing_phone(sanitize_text_field($_POST['phone']));
    $order->update_meta_data('ecb_date', $date); $order->update_meta_data('ecb_time', $time); $order->update_meta_data('ecb_product_id', $pid);
    $order->calculate_totals(); $order->update_status('processing', 'Manual booking.'); wp_send_json_success();
}

add_action('wp_ajax_ecb_admin_cancel_order', 'ecb_admin_cancel_order');
function ecb_admin_cancel_order() {
    check_ajax_referer('ecb_admin_secure_nonce', 'security'); if (!current_user_can('manage_options')) wp_send_json_error();
    $o = wc_get_order(intval($_POST['order_id']));
    if($o) { $o->update_status('cancelled', 'Freed from Dashboard.'); wp_send_json_success(); } wp_send_json_error();
}

/* ============================================================================
* 6. AUTO WHATSAPP RECEIPT HOOK
* ============================================================================ */
add_action('woocommerce_order_status_processing', 'ecb_auto_whatsapp_receipt', 10, 1);
add_action('woocommerce_order_status_completed', 'ecb_auto_whatsapp_receipt', 10, 1);
function ecb_auto_whatsapp_receipt($order_id) {
    if(!$order_id) return;
    $order = wc_get_order($order_id);
    if(!$order) return;

    if($order->get_meta('_ecb_wa_receipt_sent') === 'yes') return;

    $is_booking = false;
    foreach($order->get_items() as $item) {
        if($item->get_meta('تاريخ الزيارة')) {
            $is_booking = true;
            break;
        }
    }
    if(!$is_booking) return;

    $phone = $order->get_billing_phone();
    if(empty($phone)) return;

    $wa_num = '966' . ltrim($phone, '0');

    $items_text = '';
    foreach($order->get_items() as $i) {
        $items_text .= "- " . $i->get_name() . "\n";
        if($i->get_meta('نوع الخدمة')) {
            $items_text .= "  (" . $i->get_meta('نوع الخدمة') . ")\n";
        }
    }

    $total = wp_strip_all_tags(wc_price($order->get_total()));
    $date = $order->get_meta('ecb_date');
    $time = $order->get_meta('ecb_time');

    $text = "مرحباً " . $order->get_billing_first_name() . " 📄\n\n";
    $text .= "تم تأكيد ودفع طلبكم بنجاح في Engaz Care.\n";
    $text .= "رقم الطلب: #" . $order->get_id() . "\n\n";
    $text .= "تفاصيل الحجز:\n";
    $text .= $items_text . "\n";
    $text .= "الموعد: $date في $time\n";
    $text .= "الإجمالي: $total\n\n";
    $text .= "شكراً لثقتكم بنا! 💙\n";
    $text .= "ننتظرك قريباً.";

    $order->update_meta_data('_ecb_wa_receipt_sent', 'yes');
    $order->save();
}

/* ============================================================================
* 7. SERVICE QUOTATION CALCULATOR (SHORTCODE: [engaz_calculator])
* ============================================================================ */
add_shortcode('engaz_calculator', 'ecb_render_calculator_app');
function ecb_render_calculator_app() {
    ob_start();

    $args = array(
        'post_type' => 'product',
        'posts_per_page' => -1,
        'tax_query' => array(
            array('taxonomy' => 'product_cat', 'field' => 'slug', 'terms' => 'booking-services')
        )
    );
    $services = get_posts($args);

    ?>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <style>
        :root {
            --bg-main: #041a24;
            --bg-secondary: #072736;
            --primary: #12b3b6;
            --primary-glow: rgba(18, 179, 182, 0.4);
            --card-bg: rgba(255, 255, 255, 0.03);
            --card-border: rgba(255, 255, 255, 0.08);
            --text-light: #ffffff;
            --text-gray: #a3b8c2;
            --radius-lg: 24px;
            --radius-md: 16px;
            --radius-sm: 10px;
        }

        .ecbc-wrap {
            width: 100%; max-width: 100%; margin: 0 auto;
            font-family: 'Tajawal', sans-serif !important;
            background: rgba(7, 39, 54, 0.7);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid var(--card-border);
            border-radius: var(--radius-lg);
            padding: 40px 20px;
            color: var(--text-light); direction: rtl; text-align: right; box-sizing: border-box;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .ecbc-wrap * { box-sizing: border-box; font-family: 'Tajawal', sans-serif !important; }
        .ecbc-header { text-align: center; margin-bottom: 40px; border-bottom: 1px dashed rgba(255,255,255,0.2); padding-bottom: 30px;}
        .ecbc-header h2 { color: #ffffff; font-weight: 800; font-size: 28px; margin: 0; }
        .ecbc-header p { color: #94a3b8; margin-top: 10px; font-size: 16px; }

        .ecbc-services { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .ecbc-srv-card {
            border: 1px solid var(--card-border); border-radius: var(--radius-lg); padding: 35px 20px;
            background: rgba(7, 39, 54, 0.7); display: flex; flex-direction: column; backdrop-filter: blur(10px);
            align-items: center; text-align: center; transition: 0.4s ease; position: relative; overflow: hidden; color: var(--text-light); cursor: pointer;
        }
        .ecbc-srv-card:hover { border-color: var(--primary); background: rgba(18,179,182,0.05); transform: translateY(-5px); }
        .ecbc-srv-card.selected { border-color: var(--primary); background: rgba(18,179,182,0.15); box-shadow: 0 5px 20px var(--primary-glow);}
        .ecbc-srv-card.partial-selected { border-color: rgba(18,179,182,0.5); box-shadow: 0 2px 10px rgba(18,179,182,0.2);}
        .ecbc-srv-icon { width: 70px; height: 70px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 1px solid rgba(18,179,182,0.2); background: rgba(18,179,182,0.1); font-size: 30px; color: var(--primary);}

        .ecbc-price { color: #12b3b6; font-weight: 800; font-size: 18px; }

        .ecbc-sub-services { display: none; margin-top: 15px; width: 100%; text-align: right; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px;}
        .ecbc-srv-card.expanded .ecbc-sub-services { display: block; }

        .ecbc-radio-label { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; color:#ffffff; font-size:14px; margin:0;}
        .ecbc-main-checkbox { display: none; }
        .ecbc-srv-checkbox {
            width: 18px; height: 18px;
            outline: none; cursor: pointer; transition: 0.2s;
            margin:0; flex-shrink: 0;
            accent-color: var(--primary);
        }

        .ecbc-total-box {
            background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.3);
            padding: 30px; border-radius: 12px; text-align: center;
            margin-bottom: 30px; transition: 0.3s; color: #ffffff;
        }
        .ecbc-total-box.active { border-color: #12b3b6; background: rgba(18,179,182,0.05); }
        .ecbc-total-box h3 { margin: 0 0 10px 0; color: #12b3b6; font-size: 20px; font-weight: 800; }
        .ecbc-total-amount { font-size: 40px; font-weight: 900; color: #ffffff; }

        .ecbc-actions { display: flex; gap: 15px; justify-content: center; }
        .ecbc-btn {
            width: 100%; padding: 20px; border: none; border-radius: 12px;
            font-size: 18px; font-weight: 800; cursor: pointer;
            transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .ecbc-btn-primary { background: var(--primary); color: #041a24; box-shadow: 0 8px 20px var(--primary-glow);}
        .ecbc-btn-primary:hover { background: transparent; color: var(--primary); box-shadow: 0 0 15px var(--primary-glow) inset; border: 1px solid var(--primary); transform: translateY(-3px); }

        #ecbc_pdf_content { display: none; }

        @media print {
            body * { visibility: hidden !important; }
            html, body { width: 100%; height: 100%; margin: 0 !important; padding: 0 !important; overflow: hidden !important; background: #fff !important; }
            #ecbc_pdf_content, #ecbc_pdf_content * { visibility: visible !important; }
            #ecbc_pdf_content { display: block !important; position: absolute; left: 0; right: 0; top: 0; width: 100%; height: 100%; overflow: hidden; max-width: 210mm; margin: 0 auto; padding: 10mm 15mm !important; box-sizing: border-box; }
            #ecbc_pdf_content table { page-break-inside: avoid; }
            @page { size: A4 portrait; margin: 0; }
        }

        @media (max-width: 600px) {
            .ecbc-services { grid-template-columns: 1fr; }
        }
    </style>

    <div class="ecbc-wrap" id="ecbc_calculator">
        <div class="ecbc-header">
            <h2>حاسبة تسعيرة الخدمات</h2>
            <p>اختر الخدمات للحصول على عرض سعر فوري وتحميله كملف PDF</p>
        </div>

        <div class="ecbc-services">
            <?php foreach($services as $service):
                $reg_price = floatval(get_post_meta($service->ID, '_regular_price', true));
                $sale_price = floatval(get_post_meta($service->ID, '_sale_price', true));
                $active_price = ($sale_price > 0 && $sale_price < $reg_price) ? $sale_price : $reg_price;
                $sub_services_raw = get_post_meta($service->ID, '_ecb_sub_services', true);

                $has_subs = false;
                $min_sub_price = -1;
                if(!empty($sub_services_raw)) {
                    $subs = explode('|', $sub_services_raw);
                    foreach($subs as $sub) {
                        $parts = explode(':', $sub);
                        if(count($parts) >= 2) {
                            $has_subs = true;
                            $r = floatval(trim($parts[1]));
                            $s = isset($parts[2]) ? floatval(trim($parts[2])) : 0;
                            $p = ($s > 0 && $s < $r) ? $s : $r;
                            if($min_sub_price === -1 || $p < $min_sub_price) $min_sub_price = $p;
                        }
                    }
                }

                if($active_price <= 0 && !$has_subs) continue;
                $onclick_attr = $has_subs ? "onclick=\"this.classList.toggle('expanded')\"" : "onclick=\"let cb=this.querySelector('input'); if(event.target!==cb){cb.checked=!cb.checked; ecbcRecalculate();}\"";
            ?>
            <div class="ecbc-srv-card" <?php echo $onclick_attr; ?>>
                <?php if(!$has_subs && $active_price > 0): ?>
                    <input type="checkbox" class="ecbc-srv-checkbox ecbc-main-checkbox" value="<?php echo esc_attr($active_price); ?>" data-name="<?php echo esc_attr($service->post_title); ?>" onclick="event.stopPropagation(); ecbcRecalculate();">
                <?php endif; ?>

                <div style="background: rgba(18,179,182,0.1); color: #12b3b6; padding: 5px 15px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 15px;">Service</div>

                <h4 style="margin:0 0 10px; font-weight:800; font-size:18px; color:#ffffff;"><?php echo esc_html($service->post_title); ?></h4>
                <div class="ecbc-price">
                    <?php if($has_subs && $min_sub_price !== -1): ?>
                        <span style="font-size:14px; font-weight:normal; color:#94a3b8;">تبدأ من </span> <?php echo wc_price($min_sub_price); ?>
                    <?php else: ?>
                        <?php if ($sale_price > 0 && $sale_price < $reg_price): ?>
                            <del style="opacity:0.6; font-size:14px; margin-left:5px; color:#ffffff;"><?php echo wc_price($reg_price); ?></del>
                            <?php echo wc_price($sale_price); ?>
                        <?php else: ?>
                            <?php echo wc_price($active_price ?: 0); ?>
                        <?php endif; ?>
                    <?php endif; ?>
                </div>

                <?php if(!empty($sub_services_raw)): ?>
                <div class="ecbc-sub-services" onclick="event.stopPropagation();">
                    <?php
                    $subs = explode('|', $sub_services_raw);
                    foreach($subs as $sub):
                        $parts = explode(':', $sub);
                        if(count($parts) >= 2):
                            $sub_name = trim($parts[0]);
                            $sub_reg = floatval(trim($parts[1]));
                            $sub_sale = isset($parts[2]) ? floatval(trim($parts[2])) : 0;
                            $sub_price = ($sub_sale > 0 && $sub_sale < $sub_reg) ? $sub_sale : $sub_reg;
                    ?>
                    <label class="ecbc-radio-label">
                        <span style="display:flex; align-items:center; gap:10px;">
                            <input type="checkbox" class="ecbc-srv-checkbox" value="<?php echo esc_attr($sub_price); ?>" data-name="<?php echo esc_attr($service->post_title) . ' - ' . esc_attr($sub_name); ?>" onchange="ecbcRecalculate()" style="accent-color: var(--primary); width: 18px; height: 18px;">
                            <?php echo esc_html($sub_name); ?>
                        </span>
                        <strong style="color:#12b3b6;">
                            <?php if($sub_sale > 0 && $sub_sale < $sub_reg): ?>
                                <del style="opacity:0.6; font-size:12px; margin-left:5px; color:#ffffff;"><?php echo wc_price($sub_reg); ?></del>
                            <?php endif; ?>
                            <?php echo wc_price($sub_price); ?>
                        </strong>
                    </label>
                    <?php endif; endforeach; ?>
                </div>
                <?php endif; ?>
            </div>
            <?php endforeach; ?>
        </div>

        <div class="ecbc-total-box" id="ecbc_total_box">
            <h3>الإجمالي التقريبي</h3>
            <div class="ecbc-total-amount" id="ecbc_total_amount">0 ر.س</div>
        </div>

        <button class="ecbc-btn ecbc-btn-primary" onclick="ecbcDownloadPDF()">تحميل عرض السعر PDF</button>
    </div>

    <div id="ecbc_pdf_content" style="font-family: 'Tajawal', sans-serif; direction: rtl; text-align: right; padding: 40px;">
        <div style="text-align:center; margin-bottom:30px; border-bottom: 2px solid #12b3b6; padding-bottom:20px;">
            <h1 style="color:#041a24; margin:0;">Engaz Care</h1>
            <p style="color:#64748b; margin:5px 0;">عرض سعر</p>
            <p style="color:#94a3b8; font-size:12px;" id="ecbc_pdf_date"></p>
        </div>
        <table style="width:100%; border-collapse:collapse; margin-bottom:30px;" id="ecbc_pdf_table">
            <thead><tr style="background:#f8fafc;"><th style="padding:12px; border:1px solid #e2e8f0; text-align:right;">الخدمة</th><th style="padding:12px; border:1px solid #e2e8f0; text-align:center; width:120px;">السعر</th></tr></thead>
            <tbody id="ecbc_pdf_body"></tbody>
            <tfoot><tr style="background:#f0fdf4;"><td style="padding:12px; border:1px solid #e2e8f0; font-weight:bold;">الإجمالي</td><td style="padding:12px; border:1px solid #e2e8f0; text-align:center; font-weight:bold; color:#12b3b6;" id="ecbc_pdf_total">0 ر.س</td></tr></tfoot>
        </table>
        <p style="text-align:center; color:#94a3b8; font-size:12px;">هذا عرض سعر تقريبي. الأسعار قد تختلف حسب التفاصيل.</p>
    </div>

    <script>
        function ecbcRecalculate() {
            let total = 0;
            let checkboxes = document.querySelectorAll('.ecbc-srv-checkbox:checked');
            checkboxes.forEach(cb => { total += parseFloat(cb.value) || 0; });
            document.getElementById('ecbc_total_amount').innerText = total.toLocaleString('ar-SA') + ' ر.س';
            let box = document.getElementById('ecbc_total_box');
            if(total > 0) { box.classList.add('active'); } else { box.classList.remove('active'); }

            document.querySelectorAll('.ecbc-srv-card').forEach(card => {
                let subs = card.querySelectorAll('.ecbc-srv-checkbox:checked');
                let totalSubs = card.querySelectorAll('.ecbc-srv-checkbox');
                if(subs.length > 0 && subs.length < totalSubs.length) card.classList.add('partial-selected');
                else card.classList.remove('partial-selected');
                if(subs.length > 0) card.classList.add('selected'); else card.classList.remove('selected');
            });
        }

        function ecbcDownloadPDF() {
            let total = 0;
            let body = document.getElementById('ecbc_pdf_body'); body.innerHTML = '';
            let checkboxes = document.querySelectorAll('.ecbc-srv-checkbox:checked');
            if(checkboxes.length === 0) { if(typeof Swal !== 'undefined') { Swal.fire({icon:'info', title:'تنبيه', text:'يرجى اختيار خدمة واحدة على الأقل.', confirmButtonColor:'#12b3b6'}); } return; }
            checkboxes.forEach(cb => {
                let price = parseFloat(cb.value) || 0; total += price;
                let row = body.insertRow();
                row.innerHTML = `<td style="padding:12px; border:1px solid #e2e8f0;">${cb.getAttribute('data-name')}</td><td style="padding:12px; border:1px solid #e2e8f0; text-align:center;">${price.toLocaleString('ar-SA')} ر.س</td>`;
            });
            document.getElementById('ecbc_pdf_total').innerText = total.toLocaleString('ar-SA') + ' ر.س';
            document.getElementById('ecbc_pdf_date').innerText = new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
            window.print();
        }
    </script>
    <?php
    return ob_get_clean();
}

/* ============================================================================
* 8. TESTIMONIALS SHORTCODE [ecb_testimonials]
* ============================================================================ */
add_shortcode('ecb_testimonials', 'ecb_render_testimonials');
function ecb_render_testimonials() {
    $testimonials = get_option('ecb_testimonials', array());
    if(empty($testimonials)) return '';

    ob_start();
    ?>
    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:20px; direction:rtl; font-family:'Tajawal', sans-serif;">
        <?php foreach($testimonials as $tst): ?>
        <div style="background:rgba(7,39,54,0.7); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:25px; backdrop-filter:blur(15px); color:#fff;">
            <div style="display:flex; gap:12px; align-items:center; margin-bottom:15px;">
                <?php if(!empty($tst['image'])): ?>
                    <img src="<?php echo esc_url($tst['image']); ?>" style="width:50px; height:50px; border-radius:50%; object-fit:cover; border:2px solid #12b3b6;">
                <?php else: ?>
                    <div style="width:50px; height:50px; border-radius:50%; background:rgba(18,179,182,0.2); display:flex; align-items:center; justify-content:center; font-size:20px;">👤</div>
                <?php endif; ?>
                <div>
                    <strong style="font-size:16px;"><?php echo esc_html($tst['name']); ?></strong>
                    <div style="color:#f59e0b; font-size:14px;"><?php for($i=1;$i<=5;$i++) echo $i<=$tst['rating']?'★':'☆'; ?></div>
                </div>
            </div>
            <p style="color:#a3b8c2; font-size:15px; line-height:1.8; margin:0;">"<?php echo esc_html($tst['text']); ?>"</p>
        </div>
        <?php endforeach; ?>
    </div>
    <?php
    return ob_get_clean();
}

/* ============================================================================
* 8b. PORTFOLIO SHORTCODE [ecb_portfolio]
* ============================================================================ */
add_shortcode('ecb_portfolio', 'ecb_render_portfolio');
function ecb_render_portfolio() {
    $portfolio = get_option('ecb_portfolio', array());
    if(empty($portfolio)) return '';

    ob_start();
    ?>
    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:20px; direction:rtl; font-family:'Tajawal', sans-serif;">
        <?php foreach($portfolio as $pf): ?>
        <a href="<?php echo esc_url($pf['link']); ?>" target="_blank" style="text-decoration:none; display:block;">
            <div style="background:rgba(7,39,54,0.7); border:1px solid rgba(255,255,255,0.08); border-radius:16px; overflow:hidden; backdrop-filter:blur(15px); color:#fff; transition:0.3s; cursor:pointer;" onmouseover="this.style.borderColor='#12b3b6'; this.style.transform='translateY(-5px)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.transform='none'">
                <?php if(!empty($pf['image'])): ?>
                    <img src="<?php echo esc_url($pf['image']); ?>" style="width:100%; height:180px; object-fit:cover;">
                <?php endif; ?>
                <div style="padding:20px;">
                    <h4 style="margin:0 0 8px; font-size:18px; font-weight:800; color:#fff;"><?php echo esc_html($pf['title']); ?></h4>
                    <p style="color:#a3b8c2; font-size:14px; margin:0 0 10px; line-height:1.6;"><?php echo esc_html($pf['description']); ?></p>
                    <span style="color:#12b3b6; font-size:13px; font-weight:600;">🔗 عرض المشروع</span>
                </div>
            </div>
        </a>
        <?php endforeach; ?>
    </div>
    <?php
    return ob_get_clean();
}

/* ============================================================================
* 8c. PLANS SHORTCODE [ecb_plans]
* ============================================================================ */
add_shortcode('ecb_plans', 'ecb_render_plans');
function ecb_render_plans() {
    $plans = get_option('ecb_plans', array());
    if(empty($plans)) return '';

    ob_start();
    ?>
    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:20px; direction:rtl; font-family:'Tajawal', sans-serif;">
        <?php foreach($plans as $plan): ?>
        <div style="background:rgba(7,39,54,0.7); border:1px solid <?php echo $plan['is_popular'] ? '#12b3b6' : 'rgba(255,255,255,0.08)'; ?>; border-radius:16px; padding:30px; backdrop-filter:blur(15px); color:#fff; position:relative; <?php echo $plan['is_popular'] ? 'box-shadow:0 5px 25px rgba(18,179,182,0.3);' : ''; ?>">
            <?php if($plan['is_popular']): ?>
                <div style="position:absolute; top:-12px; right:20px; background:#12b3b6; color:#041a24; padding:4px 16px; border-radius:20px; font-size:12px; font-weight:800;">الأكثر طلباً</div>
            <?php endif; ?>
            <h3 style="margin:0 0 5px; font-size:20px; font-weight:800; color:#fff;"><?php echo esc_html($plan['name']); ?></h3>
            <div style="margin:15px 0;">
                <span style="font-size:36px; font-weight:900; color:#12b3b6;"><?php echo esc_html($plan['price']); ?></span>
                <span style="color:#a3b8c2; font-size:14px;"> SAR <?php echo esc_html($plan['period']); ?></span>
            </div>
            <ul style="list-style:none; padding:0; margin:15px 0 0;">
                <?php
                $features = explode("\n", $plan['features']);
                foreach($features as $f): $f = trim($f); if(!empty($f)): ?>
                    <li style="padding:6px 0; font-size:14px; color:#a3b8c2; display:flex; gap:8px; align-items:center;">
                        <span style="color:#10b981; font-weight:bold;">✓</span> <?php echo esc_html($f); ?>
                    </li>
                <?php endif; endforeach; ?>
            </ul>
        </div>
        <?php endforeach; ?>
    </div>
    <?php
    return ob_get_clean();
}

/* ============================================================================
* 9. DYNAMIC WOOCOMMERCE CHECKOUT & THANK YOU PAGE + FAWATERAK REFERENCE
* ============================================================================ */
add_action('wp_footer', 'ecb_style_wc_checkout_pages', 999);
function ecb_style_wc_checkout_pages() {
    if ( (function_exists('is_checkout') && is_checkout()) || is_page('checkout') || (function_exists('is_wc_endpoint_url') && is_wc_endpoint_url('order-received')) ) {

        $is_en = (strpos($_SERVER['REQUEST_URI'], '/en/') !== false || get_locale() === 'en_US' || get_locale() === 'en_GB');
        $align = $is_en ? 'left' : 'right';
        $dir = $is_en ? 'ltr' : 'rtl';

        ?>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
        <style>
            /* --- MAIN CONTAINER --- */
            body.woocommerce-checkout .woocommerce,
            body.woocommerce-page .woocommerce {
                font-family: 'Tajawal', sans-serif !important;
                background: #041a24 !important;
                color: #ffffff !important;
                padding: 40px 50px !important;
                border-radius: 24px !important;
                direction: <?php echo $dir; ?> !important;
                border: 1px solid rgba(255, 255, 255, 0.05) !important;
                box-shadow: 0 25px 50px rgba(0,0,0,0.4) !important;
                max-width: 1000px !important;
                margin: 40px auto !important;
                box-sizing: border-box !important;
            }

            @media (max-width: 768px) {
                body.woocommerce-checkout .woocommerce,
                body.woocommerce-page .woocommerce {
                    padding: 25px 15px !important;
                    margin: 0 auto !important;
                    border-radius: 0 !important;
                    width: 100% !important;
                    border-left: none !important;
                    border-right: none !important;
                }
            }

            @media (min-width: 769px) {
                body.woocommerce-checkout form.checkout {
                    display: grid !important;
                    grid-template-columns: 1fr 1fr !important;
                    gap: 40px !important;
                }
                body.woocommerce-checkout #customer_details { width: 100% !important; margin: 0 !important; }
                body.woocommerce-checkout #order_review_heading,
                body.woocommerce-checkout #order_review { width: 100% !important; margin-top: 0 !important; }
                body.woocommerce-checkout #order_review_heading { margin-bottom: -20px !important; }
            }

            .woocommerce h1, .woocommerce h2, .woocommerce h3, .woocommerce h4, .woocommerce label {
                color: #ffffff !important;
                font-family: 'Tajawal', sans-serif !important;
                text-align: <?php echo $align; ?> !important;
            }
            .woocommerce h1, .woocommerce h2, .woocommerce h3 { font-weight: 800 !important; margin-bottom: 20px !important; }
            .woocommerce label { font-weight: 500 !important; font-size: 14px !important; color: #a3b8c2 !important; }

            .woocommerce input.input-text,
            .woocommerce select,
            .woocommerce textarea {
                background: rgba(255, 255, 255, 0.04) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                color: #ffffff !important;
                border-radius: 10px !important;
                padding: 14px 18px !important;
                font-family: 'Tajawal', sans-serif !important;
                width: 100% !important;
                transition: all 0.3s ease !important;
                outline: none !important;
            }
            .woocommerce input.input-text:focus,
            .woocommerce select:focus,
            .woocommerce textarea:focus {
                border-color: #12b3b6 !important;
                background: rgba(18, 179, 182, 0.05) !important;
                box-shadow: 0 0 0 3px rgba(18, 179, 182, 0.15) !important;
            }
            .woocommerce input[type="radio"],
            .woocommerce input[type="checkbox"] {
                accent-color: #12b3b6 !important;
                width: 16px; height: 16px;
            }

            .woocommerce-notice::before, .woocommerce-notice::after,
            .woocommerce-message::before, .woocommerce-message::after,
            .woocommerce-info::before { display: none !important; }

            .woocommerce-notice.woocommerce-notice--success,
            .woocommerce-message, .woocommerce-info,
            .woocommerce-thankyou-order-received {
                background: rgba(18, 179, 182, 0.05) !important;
                border: 1px solid #12b3b6 !important;
                color: #12b3b6 !important;
                border-radius: 12px !important;
                text-align: center !important;
                padding: 18px 20px !important;
                margin-bottom: 30px !important;
            }

            .woocommerce-order {
                background: rgba(255, 255, 255, 0.02) !important;
                padding: 30px !important;
                border-radius: 20px !important;
                border: 1px solid rgba(255, 255, 255, 0.05) !important;
            }

            ul.woocommerce-order-overview {
                display: flex !important; flex-wrap: wrap !important;
                background: rgba(0, 0, 0, 0.2) !important;
                padding: 25px !important; border-radius: 16px !important;
                border: 1px solid rgba(255, 255, 255, 0.03) !important;
                list-style: none !important; margin: 0 0 30px 0 !important; gap: 15px;
            }
            ul.woocommerce-order-overview li {
                border: none !important; border-inline-start: 1px solid rgba(255,255,255,0.1) !important;
                color: #a3b8c2 !important; text-align: center !important; flex: 1 !important;
                padding: 0 10px !important; margin: 0 !important; font-size: 13px !important; text-transform: uppercase;
            }
            ul.woocommerce-order-overview li:first-child { border-inline-start: none !important; }
            ul.woocommerce-order-overview li strong {
                color: #ffffff !important; display: block !important; margin-top: 8px !important;
                font-size: 18px !important; text-transform: none;
            }

            @media (max-width: 768px) {
                ul.woocommerce-order-overview { flex-direction: column !important; gap: 20px !important; }
                ul.woocommerce-order-overview li { border-inline-start: none !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; padding-bottom: 15px !important; }
                ul.woocommerce-order-overview li:last-child { border-bottom: none !important; padding-bottom: 0 !important; }
            }

            .woocommerce table.shop_table {
                border-collapse: collapse !important; border: none !important;
                width: 100% !important; margin: 20px 0 !important;
            }
            .woocommerce table.shop_table th, .woocommerce table.shop_table td {
                color: #ffffff !important; border: none !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
                padding: 16px 10px !important; text-align: <?php echo $align; ?> !important;
                background: transparent !important;
            }
            .woocommerce table.shop_table thead th {
                color: #a3b8c2 !important; font-size: 14px !important; font-weight: 500 !important;
                border-bottom: 2px solid rgba(255, 255, 255, 0.1) !important;
            }
            .woocommerce table.shop_table tfoot th, .woocommerce table.shop_table tfoot td {
                border-bottom: none !important; border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
            }
            .woocommerce table.shop_table .order-total th, .woocommerce table.shop_table .order-total td {
                font-size: 18px !important; color: #12b3b6 !important; font-weight: 800 !important;
            }

            #payment {
                background: rgba(0, 0, 0, 0.2) !important;
                border-radius: 16px !important;
                border: 1px solid rgba(255, 255, 255, 0.05) !important;
                padding: 25px !important; margin-top: 30px !important;
            }
            #payment ul.payment_methods {
                border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
                padding: 0 0 20px 0 !important; background: transparent !important;
            }
            #payment div.payment_box {
                background: rgba(255, 255, 255, 0.03) !important; color: #a3b8c2 !important;
                border-radius: 10px !important; border: 1px solid rgba(255, 255, 255, 0.05) !important;
                padding: 15px !important; margin-top: 15px !important; font-size: 14px !important;
            }
            #payment div.payment_box::before { display: none !important; }

            .button.alt, #place_order {
                background: #12b3b6 !important; color: #041a24 !important;
                border-radius: 12px !important; font-size: 18px !important;
                font-weight: 800 !important; padding: 20px 30px !important;
                box-shadow: 0 8px 25px rgba(18, 179, 182, 0.25) !important;
                transition: all 0.3s ease !important; width: 100% !important;
                text-align: center !important; display: block !important;
                border: 2px solid #12b3b6 !important; margin-top: 25px !important;
                cursor: pointer !important;
            }
            .button.alt:hover, #place_order:hover {
                background: #041a24 !important; color: #12b3b6 !important;
                box-shadow: 0 0 20px rgba(18, 179, 182, 0.4) !important;
            }

            /* Fawaterak reference number styling */
            .ecb-fawaterak-ref {
                background: rgba(18, 179, 182, 0.1) !important;
                border: 2px solid #12b3b6 !important;
                border-radius: 12px !important;
                padding: 20px !important;
                text-align: center !important;
                margin: 20px 0 !important;
            }
            .ecb-fawaterak-ref .ref-label {
                color: #a3b8c2 !important;
                font-size: 14px !important;
                margin-bottom: 8px !important;
            }
            .ecb-fawaterak-ref .ref-number {
                color: #12b3b6 !important;
                font-size: 28px !important;
                font-weight: 900 !important;
                letter-spacing: 3px !important;
                direction: ltr !important;
            }
        </style>
        <?php
    }
}

/* ============================================================================
* 9b. DISPLAY FAWATERAK REFERENCE NUMBER ON THANK YOU PAGE
* ============================================================================ */
add_action('woocommerce_thankyou', 'ecb_show_fawaterak_reference', 5, 1);
function ecb_show_fawaterak_reference($order_id) {
    if(!$order_id) return;
    $order = wc_get_order($order_id);
    if(!$order) return;

    $payment_method = $order->get_payment_method();

    // Check if payment was via Fawaterak (fawry method)
    if(strpos($payment_method, 'fawaterak') !== false || strpos($payment_method, 'fawry') !== false) {
        // Try to get Fawaterak reference from order meta
        $fawry_ref = $order->get_meta('_fawaterak_reference_number');
        if(empty($fawry_ref)) $fawry_ref = $order->get_meta('fawaterak_reference_number');
        if(empty($fawry_ref)) $fawry_ref = $order->get_meta('_fawry_reference_number');
        if(empty($fawry_ref)) $fawry_ref = $order->get_meta('fawry_ref');
        if(empty($fawry_ref)) $fawry_ref = $order->get_meta('_fawaterak_fawry_ref');
        if(empty($fawry_ref)) $fawry_ref = $order->get_meta('referenceNumber');
        if(empty($fawry_ref)) $fawry_ref = $order->get_meta('_referenceNumber');

        // Also check transaction ID as fallback
        if(empty($fawry_ref)) $fawry_ref = $order->get_transaction_id();

        if(!empty($fawry_ref)) {
            $is_en = (strpos($_SERVER['REQUEST_URI'], '/en/') !== false || get_locale() === 'en_US');
            ?>
            <div class="ecb-fawaterak-ref">
                <div class="ref-label"><?php echo $is_en ? 'Your Fawry Payment Reference Number' : 'رقم مرجع الدفع فوري'; ?></div>
                <div class="ref-number"><?php echo esc_html($fawry_ref); ?></div>
                <p style="color:#a3b8c2; font-size:13px; margin-top:10px;">
                    <?php echo $is_en ? 'Use this number to complete payment at any Fawry outlet' : 'استخدم هذا الرقم لإتمام الدفع في أي منفذ فوري'; ?>
                </p>
            </div>
            <?php
        }
    }
}

/* ============================================================================
* 9c. DISPLAY FAWATERAK REF ON CHECKOUT ORDER-PAY PAGE
* ============================================================================ */
add_action('woocommerce_before_pay_action', 'ecb_display_fawaterak_on_pay_page', 10);
add_action('before_woocommerce_pay', 'ecb_display_fawaterak_on_checkout', 10);
function ecb_display_fawaterak_on_checkout() {
    if(!is_wc_endpoint_url('order-pay')) return;

    global $wp;
    $order_id = isset($wp->query_vars['order-pay']) ? absint($wp->query_vars['order-pay']) : 0;
    if(!$order_id) return;

    $order = wc_get_order($order_id);
    if(!$order) return;

    // Show the order total prominently
    $is_en = (strpos($_SERVER['REQUEST_URI'], '/en/') !== false || get_locale() === 'en_US');
    ?>
    <div style="background:rgba(18,179,182,0.05); border:1px solid rgba(18,179,182,0.3); border-radius:12px; padding:15px; text-align:center; margin-bottom:20px; font-family:'Tajawal',sans-serif; direction:rtl;">
        <p style="color:#a3b8c2; margin:0 0 5px; font-size:14px;"><?php echo $is_en ? 'Order' : 'طلب رقم'; ?> #<?php echo $order->get_id(); ?></p>
        <p style="color:#12b3b6; font-size:24px; font-weight:800; margin:0;"><?php echo $order->get_formatted_order_total(); ?></p>
    </div>
    <?php
}

add_action('woocommerce_thankyou', 'ecb_custom_thankyou_page', 10, 1);
function ecb_custom_thankyou_page($order_id) {
    if (!$order_id) return;

    $is_en = (strpos($_SERVER['REQUEST_URI'], '/en/') !== false || get_locale() === 'en_US' || get_locale() === 'en_GB');
    $home_url = $is_en ? home_url('/en/') : home_url();
    $btn_text = $is_en ? 'Return to Home Page' : 'العودة إلى الصفحة الرئيسية';
    $redirect_msg = $is_en
        ? 'Redirecting automatically in <span id="ecb-countdown" style="display:inline-block; background:rgba(18, 179, 182, 0.1); color:#12b3b6; padding:4px 12px; border-radius:20px; font-weight:800; margin: 0 5px;">15</span> seconds...'
        : 'سيتم تحويلك تلقائياً خلال <span id="ecb-countdown" style="display:inline-block; background:rgba(18, 179, 182, 0.1); color:#12b3b6; padding:4px 12px; border-radius:20px; font-weight:800; margin: 0 5px;">15</span> ثانية...';

    ?>
    <div class="ecb-thankyou-wrap" style="text-align:center; margin-top:50px; font-family:'Tajawal', sans-serif; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 40px;">
        <a href="<?php echo esc_url($home_url); ?>" class="button alt" style="display:inline-block; width: auto !important; min-width: 250px; padding:18px 45px !important; background:#12b3b6 !important; color:#041a24 !important; border-radius:12px !important; font-weight:800 !important; text-decoration:none !important; margin-bottom: 25px !important;">
            <?php echo esc_html($btn_text); ?>
        </a>
        <p style="color:#a3b8c2; font-size:15px; margin-top: 15px; display: flex; align-items: center; justify-content: center;">
            <svg style="width:20px; height:20px; margin-right:8px; margin-left:8px; fill:currentColor;" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
            <?php echo $redirect_msg; ?>
        </p>
    </div>
    <script>
        let ecbSeconds = 15;
        let ecbTimer = setInterval(function() {
            ecbSeconds--;
            document.getElementById('ecb-countdown').innerText = ecbSeconds;
            if(ecbSeconds <= 0) {
                clearInterval(ecbTimer);
                window.location.href = "<?php echo esc_url($home_url); ?>";
            }
        }, 1000);
    </script>
    <?php
}

/* ============================================================================
* 10. PREVENT USER DUPLICATION ON WOOCOMMERCE CHECKOUT
* ============================================================================ */
add_filter('woocommerce_checkout_customer_id', 'ecb_prevent_duplicate_user_checkout', 10, 1);
function ecb_prevent_duplicate_user_checkout($customer_id) {
    if($customer_id > 0) return $customer_id; // Already logged in

    if(isset($_POST['billing_phone'])) {
        $phone = sanitize_text_field($_POST['billing_phone']);
        $clean_phone = preg_replace('/[^0-9]/', '', $phone);
        $email = 'wa_' . $clean_phone . '@engaz.local';

        // Check if user exists with this email
        $existing = get_user_by('email', $email);
        if($existing) return $existing->ID;

        // Check by phone meta
        $user_query = new WP_User_Query(array(
            'meta_key' => 'billing_phone',
            'meta_value' => $phone,
            'number' => 1
        ));
        $found = $user_query->get_results();
        if(!empty($found)) return $found[0]->ID;
    }

    return $customer_id;
}

// Prevent WooCommerce from creating new account if user already exists
add_filter('woocommerce_checkout_posted_data', 'ecb_fix_checkout_email_for_existing', 10, 1);
function ecb_fix_checkout_email_for_existing($data) {
    if(!empty($data['billing_phone'])) {
        $phone = sanitize_text_field($data['billing_phone']);
        $clean_phone = preg_replace('/[^0-9]/', '', $phone);
        $email = 'wa_' . $clean_phone . '@engaz.local';

        // If no email was provided, use the phone-based email
        if(empty($data['billing_email']) || $data['billing_email'] === '') {
            $data['billing_email'] = $email;
        }
    }
    return $data;
}
