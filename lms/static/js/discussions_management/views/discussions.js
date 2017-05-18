(function(define) {
    'use strict';
    define(['jquery', 'underscore', 'backbone', 'gettext',
        'js/discussions_management/views/divided_discussions_inline',
        'js/discussions_management/views/divided_discussions_course_wide',
        'edx-ui-toolkit/js/utils/html-utils'
    ],

        function($, _, Backbone, gettext, InlineDiscussionsView, CourseWideDiscussionsView, HtmlUtils) {
            var DiscussionsView = Backbone.View.extend({
                events: {
                    'click .division-scheme': 'divisionSchemeChanged'
                },

                initialize: function(options) {
                    this.template = HtmlUtils.template($('#discussions-tpl').text());
                    this.context = options.context;
                    this.discussionSettings = options.discussionSettings;
                },

                render: function() {
                    HtmlUtils.setHtml(this.$el, this.template({availableSchemes: this.getDivisionSchemeData()}));
                    var selectedScheme = this.getSelectedScheme(),
                        topicNav = this.getTopicNav();
                    this.hideTopicNav(selectedScheme, topicNav);
                    this.showDiscussionTopics();
                    return this;
                },

                getDivisionSchemeData: function() {
                    // TODO: get available schemes and currently selected scheme from this.discussionSettings
                    return [
                        {
                            key: 'none',
                            displayName: gettext('Not divided'),
                            descriptiveText: gettext('Discussions are unified; all learners interact with posts from other learners, regardless of the group they are in.'),
                            selected: false
                        },
                        {
                            key: 'enrollment_track',
                            displayName: gettext('Enrollment Tracks'),
                            descriptiveText: gettext('Use enrollment tracks as the basis for dividing discussions. All learners, regardless of their enrollment track, see the same discussion topics, but within divided topics, only learners who are in the same enrollment track see and respond to each others’ posts.'),
                            selected: false
                        },
                        {
                            key: 'cohort',
                            displayName: gettext('Cohorts'),
                            descriptiveText: gettext('Use cohorts as the basis for dividing discussions. All learners, regardless of cohort, see the same discussion topics, but within divided topics, only members of the same cohort see and respond to each others’ posts. '),
                            selected: true
                        }

                    ];
                },

                getSelectedScheme: function() {
                    return this.$('input[name="division-scheme"]:checked').val();
                },

                getTopicNav: function() {
                    return this.$('.topic-division-nav');
                },

                divisionSchemeChanged: function() {
                    var selectedScheme = this.getSelectedScheme(),
                        topicNav = this.getTopicNav(),
                        messageSpan = this.$('.division-scheme-message');

                    this.hideTopicNav(selectedScheme, topicNav);
                    this.showSelectMessage(selectedScheme, messageSpan);

                },

                hideTopicNav: function(selectedScheme, topicNav) {
                    if (selectedScheme === 'none') {
                        topicNav.addClass(hiddenClass);
                    } else {
                        topicNav.removeClass(hiddenClass);
                    }
                },

                showSelectMessage: function(selectedScheme, messageSpan) {
                    switch (selectedScheme) {
                        case 'none':
                            messageSpan.text(gettext('Discussion topics in the course are not divided.'));
                            break;
                        case 'enrollment_track':
                            messageSpan.text(gettext('Any divided discussion topics are divided based on enrollment track.'));
                            break;
                        case 'cohort':
                            messageSpan.text(gettext('Any divided discussion topics are divided based on cohort.'));
                            break;
                    }
                },

                getSectionCss: function(section) {
                    return ".instructor-nav .nav-item [data-section='" + section + "']";
                },

                showDiscussionTopics: function() {
                    var dividedDiscussionsElement = this.$('.discussions-nav');
                    if (!this.CourseWideDiscussionsView) {
                        this.CourseWideDiscussionsView = new CourseWideDiscussionsView({
                            el: dividedDiscussionsElement,
                            model: this.context.courseDiscussionTopicDetailsModel,
                            discussionSettings: this.discussionSettings
                        }).render();
                    }

                    if (!this.InlineDiscussionsView) {
                        this.InlineDiscussionsView = new InlineDiscussionsView({
                            el: dividedDiscussionsElement,
                            model: this.context.courseDiscussionTopicDetailsModel,
                            discussionSettings: this.discussionSettings
                        }).render();
                    }
                }
            });
            return DiscussionsView;
        });
}).call(this, define || RequireJS.define);
