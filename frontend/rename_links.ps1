$mappings = @{
    "home.html" = "index.html"
    "home.css" = "index.css"
    "home.js" = "index.js"
    "contact_us.html" = "contact.html"
    "contact_us.css" = "contact.css"
    "contact_us.js" = "contact.js"
    "login-page.html" = "login.html"
    "login.css" = "login.css"
    "login.js" = "login.js"
    "oem_register_landingpage.html" = "register.html"
    "oem_register.css" = "register.css"
    "oem_register.js" = "register.js"
    "onboarding2.html" = "onboarding.html"
    "onboarding.css" = "onboarding.css"
    "onboarding.js" = "onboarding.js"
    "rfq_cart.html" = "cart.html"
    "rfq_cart.css" = "cart.css"
    "rfq_cart.js" = "cart.js"
    "customer_dashboard_3.html" = "dashboard-buyer.html"
    "customer_dashboard_3.css" = "dashboard-buyer.css"
    "customer_dashboard_3.js" = "dashboard-buyer.js"
    "customer_dashboard_5.html" = "dashboard-vendor.html"
    "customer_dashboard_5.css" = "dashboard-vendor.css"
    "customer_dashboard_5.js" = "dashboard-vendor.js"
}

Get-ChildItem -Path *.html, *.js, *.css | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    foreach ($old in $mappings.Keys) {
        $content = $content -replace [regex]::Escape($old), $mappings[$old]
    }
    Set-Content $_.FullName $content
}
