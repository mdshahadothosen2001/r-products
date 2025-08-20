JAZZMIN_SETTINGS = {
    #title
    "site_title": "FemmeNest world : Here admin or staff can manage admin panel",
    "site_header": "FemmeNest world",
    "site_brand": "FemmeNest world",
    "site_logo": "logo/product-icon.png",
    
    #Login card
    "login_logo":"logo/product-icon.png",
    "login_logo_dark": None,
    "site_logo_classes": "img-circle",
    "site_icon": "logo/product-icon.png",
    "welcome_sign": "Welcome to the FemmeNest world",

    #Footer
    "copyright": "by FemmeNest world | Kushghop Software",

    # List of model admins to include in the search bar
    # "search_model": ["auth.User", "menu.Menu", "menu.Item"],

    # Field name on user model that contains avatar ImageField/URLField/Charfield
    "user_avatar": None,

    #################
    # Top Menu #
    #################

    # Links to put along the top menu
    "topmenu_links": [
        # URL that gets reversed (Permissions can be added)
        {"name": "Home", "url": "admin:index", "permissions": ["auth.view_user"]},

        # External URL that opens in a new window (Permissions can be added)
        {"name": "website", "url": "http://localhost:5173", "new_window": True},

        # Management site to make order
        {"name": "ORDER MANAGEMENT", "url": "management_site", "new_window": False},

        # Model admin to link to (Permissions checked against model)
        {"model": "auth.User"},

        # App with dropdown menu to all its models pages (Permissions checked against models)
        {},
    ],

    ##################
    # User Menu #
    ##################

    # Additional links to include in the user menu on the top right
    "usermenu_links": [
        {"name": "website", "url": "http://localhost:5173", "new_window": True, "button": True, "button_classes": "btn btn-primary usermenu-hover"},
        {"name": "ORDER MANAGEMENT", "url": "management_site", "new_window": False, "button": True, "button_classes": "btn btn-success usermenu-hover"},
        {"model": "auth.user"}
    ],

    ##################
    # Side Menu #
    ##################

    # Whether to display the side menu
    "show_sidebar": True,

    # Whether to auto-expand the menu
    "navigation_expanded": True,

    # Hide these apps when generating the side menu
    "hide_apps": [],

    # Hide these models when generating the side menu
    "hide_models": [],

    # # List of apps (and/or models) to base side menu ordering off of
    # "order_with_respect_to": [],

    # # Custom links to append to app groups, keyed on app name
    # "custom_links": {},
    "custom_links": {
        "used_ingredient": [ 
            {
                "name": "Order Management",
                "url": "management_site",
                "icon": "fas fa-link",
            }
        ]
    },

    # Custom icons for side menu apps/models
    "icons": {
        "auth": "fas fa-users-cog",
        "auth.user": "fas fa-user",
        "auth.Group": "fas fa-users",
    },

    # Default icons used when none are manually specified
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",

    ##################
    # Related Modal #
    ##################

    # Use modals instead of popups
    "related_modal_active": False,

    ##################
    # UI Tweaks #
    ##################

    # Relative paths to custom CSS/JS scripts (must be present in static files)
    "custom_css": None,
    "custom_js": None,

    # Whether to link fonts from fonts.googleapis.com
    "use_google_fonts_cdn": True,

    # Whether to show the UI customizer on the sidebar
    "show_ui_builder": False,

    ##################
    # Change View #
    ##################

    # Render out the change view as a single form, or in tabs
    "changeform_format": "horizontal_tabs",  # Options: single, horizontal_tabs, vertical_tabs, collapsible, carousel

    # Override change forms on a per modeladmin basis
    "changeform_format_overrides": {"auth.user": "collapsible", "auth.group": "vertical_tabs"},

    # Add a language dropdown into the admin
    # "language_chooser": True,
}