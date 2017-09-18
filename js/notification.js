(function() {
    var storedNewNotifications,
        storedawaitingNotifications,
        newNotifications = [],
        awaitingNotifications = 0,
        opendd;
    var init = function() {
        dummyPolling();
    }

    var dummyPolling = function() {
        var randomInterval = 2 * Math.round(Math.random() * (3000 - 500)) + 1000;
        setTimeout(function() {
            getNewNotifications(newNotifications);
            if (!newNotifications || !newNotifications.length) {
                newNotifications = JSON.parse(localStorage.getItem('newNotifications'));
            }
            if (!awaitingNotifications) {
                awaitingNotifications = JSON.parse(localStorage.getItem('awaitingNotifications'));
            }
            showNotificationsOnDropDown(newNotifications)
            awaitingNotifications++;
            localStorage.setItem('newNotifications', JSON.stringify(newNotifications));
            localStorage.setItem('awaitingNotifications', JSON.stringify(awaitingNotifications));
            dummyPolling();
            $('#notifications-count').html(awaitingNotifications);
            $('#dd-notifications-count').html(awaitingNotifications);
        }, randomInterval);
    }

    // creates and returns a new notification
    var getNewNotifications = function(newNotifications) {
        var userIndex = getRandomNumber();
        var actionIndex = getRandomNumber();
        var actionTargetIndex = getRandomNumber();
        var newNotification = {
            user: pollingData.users[userIndex],
            action: pollingData.actions[actionIndex],
            timestamp: new Date()
        }
        newNotifications.push(newNotification);
    };

    //generates a random number between 0 and 2 to select random polling data
    var getRandomNumber = function() {
        return Math.floor(Math.random() * 2);
    };

    // New notification is created by selecting random user, action and targets from this object
    var pollingData = {
        users: [{
                name: "Akash Thawait",
                imageUrl: "img/male.png"
            },
            {
                name: "Smita Tamboli",
                imageUrl: "img/female.png"
            }
        ],
        actions: ["commented on your wall", "posted on your wall", "shared your post"]
    };

    var showNotifications = function() {
        var targetdd = $('.dropdown-menu');
        opendd = targetdd;
        if (targetdd.hasClass('fadeInDown')) {
            hideDropDown(targetdd);
        } else {
            targetdd.css('display', 'block').removeClass('fadeOutUp').addClass('fadeInDown')
                .on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function() {
                    $(this).show();
                });
            targetdd.find('.dropdown-body')[0].scrollTop = 0;
            awaitingNotifications = 0;
            $('#dd-notifications-count').html(awaitingNotifications);
            $('#notifications-count').removeClass('fadeIn').addClass('fadeOut');
        }
    };

    //Hide dropdown function
    var hideDropDown = function(targetdd) {
        targetdd.removeClass('fadeInDown').addClass('fadeOutUp')
            .on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function() {
                $(this).hide();
            });
        opendd = null;
        awaitingNotifications = 0;
        newNotifications = [];
        localStorage.setItem('newNotifications', JSON.stringify(newNotifications));
        localStorage.setItem('awaitingNotifications', JSON.stringify(awaitingNotifications));
        $('#notifications-count').removeClass('fadeOut').addClass('fadeIn');
        $('#notifications-count').html(awaitingNotifications);
    }
    init();

    // Method to show notification in dropdown
    var showNotificationsOnDropDown = function(notifications) {
        notifications.forEach(function(notification) {
            if (notification && notification.user && notification.user.name) {
                $('.dropdown-body').append('<div class="notification new"><div class="notification-image-wrapper"><div class="notification-image"><img src=' + notification.user.imageUrl + ' alt="" width="32"></div></div><div class="notification-text"><span class="highlight">' + notification.user.name + ' </span>' + notification.action + ' </div></div>')
            }
        });
    }

    var hideInfo = function() {
        $('#demoInfo').addClass('zoomOut')
            .on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function() {
                $(this).hide();
                $('.instruction').addClass('zoomIn').show();
            });
    }

    // Method to close dropdown when click on anywhere in HTML
    window.onclick = function(event) {
        var clickedElement = $(event.target);
        var clickedDdTrigger = clickedElement.closest('.dd-trigger').length;
        var clickedDdContainer = clickedElement.closest('.dropdown-menu').length;
        if (opendd != null && clickedDdTrigger == 0 && clickedDdContainer == 0) {
            hideDropDown(opendd);
        }
    }

    // Exposing methods
    return fn = {
        showNotifications: showNotifications,
        hideInfo: hideInfo
    }
})();