
function gtaEvent(category, label)
{
    gtag('event', "buttonClick",
        {
            'event_category': category,
            'event_label': label
        });
}
