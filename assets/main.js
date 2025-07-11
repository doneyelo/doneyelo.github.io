/* Carrd Site JS | carrd.co | License: MIT */

(function() {

	// Main.
		var	on = addEventListener,
			off = removeEventListener,
			$ = function(q) { return document.querySelector(q) },
			$$ = function(q) { return document.querySelectorAll(q) },
			$body = document.body,
			$inner = $('.inner'),
			client = (function() {
		
				var o = {
						browser: 'other',
						browserVersion: 0,
						os: 'other',
						osVersion: 0,
						mobile: false,
						canUse: null,
						flags: {
							lsdUnits: false,
						},
					},
					ua = navigator.userAgent,
					a, i;
		
				// browser, browserVersion.
					a = [
						[
							'firefox',
							/Firefox\/([0-9\.]+)/,
							null
						],
						[
							'edge',
							/Edge\/([0-9\.]+)/,
							null
						],
						[
							'safari',
							/Version\/([0-9\.]+).+Safari/,
							null
						],
						[
							'chrome',
							/Chrome\/([0-9\.]+)/,
							null
						],
						[
							'chrome',
							/CriOS\/([0-9\.]+)/,
							null
						],
						[
							'ie',
							/Trident\/.+rv:([0-9]+)/,
							null
						],
						[
							'safari',
							/iPhone OS ([0-9_]+)/,
							function(v) { return v.replace('_', '.').replace('_', ''); }
						]
					];
		
					for (i=0; i < a.length; i++) {
		
						if (ua.match(a[i][1])) {
		
							o.browser = a[i][0];
							o.browserVersion = parseFloat( a[i][2] ? (a[i][2])(RegExp.$1) : RegExp.$1 );
		
							break;
		
						}
		
					}
		
				// os, osVersion.
					a = [
						[
							'ios',
							/([0-9_]+) like Mac OS X/,
							function(v) { return v.replace('_', '.').replace('_', ''); }
						],
						[
							'ios',
							/CPU like Mac OS X/,
							function(v) { return 0 }
						],
						[
							'ios',
							/iPad; CPU/,
							function(v) { return 0 }
						],
						[
							'android',
							/Android ([0-9\.]+)/,
							null
						],
						[
							'mac',
							/Macintosh.+Mac OS X ([0-9_]+)/,
							function(v) { return v.replace('_', '.').replace('_', ''); }
						],
						[
							'windows',
							/Windows NT ([0-9\.]+)/,
							null
						],
						[
							'undefined',
							/Undefined/,
							null
						]
					];
		
					for (i=0; i < a.length; i++) {
		
						if (ua.match(a[i][1])) {
		
							o.os = a[i][0];
							o.osVersion = parseFloat( a[i][2] ? (a[i][2])(RegExp.$1) : RegExp.$1 );
		
							break;
		
						}
		
					}
		
					// Hack: Detect iPads running iPadOS.
						if (o.os == 'mac'
						&&	('ontouchstart' in window)
						&&	(
		
							// 12.9"
								(screen.width == 1024 && screen.height == 1366)
							// 10.2"
								||	(screen.width == 834 && screen.height == 1112)
							// 9.7"
								||	(screen.width == 810 && screen.height == 1080)
							// Legacy
								||	(screen.width == 768 && screen.height == 1024)
		
						))
							o.os = 'ios';
		
				// mobile.
					o.mobile = (o.os == 'android' || o.os == 'ios');
		
				// canUse.
					var _canUse = document.createElement('div');
		
					o.canUse = function(property, value) {
		
						var style;
		
						// Get style.
							style = _canUse.style;
		
						// Property doesn't exist? Can't use it.
							if (!(property in style))
								return false;
		
						// Value provided?
							if (typeof value !== 'undefined') {
		
								// Assign value.
									style[property] = value;
		
								// Value is empty? Can't use it.
									if (style[property] == '')
										return false;
		
							}
		
						return true;
		
					};
		
				// flags.
					o.flags.lsdUnits = o.canUse('width', '100dvw');
		
				return o;
		
			}()),
			ready = {
				list: [],
				add: function(f) {
					this.list.push(f);
				},
				run: function() {
					this.list.forEach((f) => {
						f();
					});
				},
			},
			trigger = function(t) {
				dispatchEvent(new Event(t));
			},
			cssRules = function(selectorText) {
		
				var ss = document.styleSheets,
					a = [],
					f = function(s) {
		
						var r = s.cssRules,
							i;
		
						for (i=0; i < r.length; i++) {
		
							if (r[i] instanceof CSSMediaRule && matchMedia(r[i].conditionText).matches)
								(f)(r[i]);
							else if (r[i] instanceof CSSStyleRule && r[i].selectorText == selectorText)
								a.push(r[i]);
		
						}
		
					},
					x, i;
		
				for (i=0; i < ss.length; i++)
					f(ss[i]);
		
				return a;
		
			},
			escapeHtml = function(s) {
		
				// Blank, null, or undefined? Return blank string.
					if (s === ''
					||	s === null
					||	s === undefined)
						return '';
		
				// Escape HTML characters.
					var a = {
						'&': '&amp;',
						'<': '&lt;',
						'>': '&gt;',
						'"': '&quot;',
						"'": '&#39;',
					};
		
					s = s.replace(/[&<>"']/g, function(x) {
						return a[x];
					});
		
				return s;
		
			},
			thisHash = function() {
		
				var h = location.hash ? location.hash.substring(1) : null,
					a;
		
				// Null? Bail.
					if (!h)
						return null;
		
				// Query string? Move before hash.
					if (h.match(/\?/)) {
		
						// Split from hash.
							a = h.split('?');
							h = a[0];
		
						// Update hash.
							history.replaceState(undefined, undefined, '#' + h);
		
						// Update search.
							window.location.search = a[1];
		
					}
		
				// Prefix with "x" if not a letter.
					if (h.length > 0
					&&	!h.match(/^[a-zA-Z]/))
						h = 'x' + h;
		
				// Convert to lowercase.
					if (typeof h == 'string')
						h = h.toLowerCase();
		
				return h;
		
			},
			scrollToElement = function(e, style, duration) {
		
				var y, cy, dy,
					start, easing, offset, f;
		
				// Element.
		
					// No element? Assume top of page.
						if (!e)
							y = 0;
		
					// Otherwise ...
						else {
		
							offset = (e.dataset.scrollOffset ? parseInt(e.dataset.scrollOffset) : 0) * parseFloat(getComputedStyle(document.documentElement).fontSize);
		
							switch (e.dataset.scrollBehavior ? e.dataset.scrollBehavior : 'default') {
		
								case 'default':
								default:
		
									y = e.offsetTop + offset;
		
									break;
		
								case 'center':
		
									if (e.offsetHeight < window.innerHeight)
										y = e.offsetTop - ((window.innerHeight - e.offsetHeight) / 2) + offset;
									else
										y = e.offsetTop - offset;
		
									break;
		
								case 'previous':
		
									if (e.previousElementSibling)
										y = e.previousElementSibling.offsetTop + e.previousElementSibling.offsetHeight + offset;
									else
										y = e.offsetTop + offset;
		
									break;
		
							}
		
						}
		
				// Style.
					if (!style)
						style = 'smooth';
		
				// Duration.
					if (!duration)
						duration = 750;
		
				// Instant? Just scroll.
					if (style == 'instant') {
		
						window.scrollTo(0, y);
						return;
		
					}
		
				// Get start, current Y.
					start = Date.now();
					cy = window.scrollY;
					dy = y - cy;
		
				// Set easing.
					switch (style) {
		
						case 'linear':
							easing = function (t) { return t };
							break;
		
						case 'smooth':
							easing = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 };
							break;
		
					}
		
				// Scroll.
					f = function() {
		
						var t = Date.now() - start;
		
						// Hit duration? Scroll to y and finish.
							if (t >= duration)
								window.scroll(0, y);
		
						// Otherwise ...
							else {
		
								// Scroll.
									window.scroll(0, cy + (dy * easing(t / duration)));
		
								// Repeat.
									requestAnimationFrame(f);
		
							}
		
					};
		
					f();
		
			},
			scrollToTop = function() {
		
				// Scroll to top.
					scrollToElement(null);
		
			},
			loadElements = function(parent) {
		
				var a, e, x, i;
		
				// IFRAMEs.
		
					// Get list of unloaded IFRAMEs.
						a = parent.querySelectorAll('iframe[data-src]:not([data-src=""])');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Load.
								a[i].contentWindow.location.replace(a[i].dataset.src);
		
							// Save initial src.
								a[i].dataset.initialSrc = a[i].dataset.src;
		
							// Mark as loaded.
								a[i].dataset.src = '';
		
						}
		
				// Video.
		
					// Get list of videos (autoplay).
						a = parent.querySelectorAll('video[autoplay]');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Play if paused.
								if (a[i].paused)
									a[i].play();
		
						}
		
				// Autofocus.
		
					// Get first element with data-autofocus attribute.
						e = parent.querySelector('[data-autofocus="1"]');
		
					// Determine type.
						x = e ? e.tagName : null;
		
						switch (x) {
		
							case 'FORM':
		
								// Get first input.
									e = e.querySelector('.field input, .field select, .field textarea');
		
								// Found? Focus.
									if (e)
										e.focus();
		
								break;
		
							default:
								break;
		
						}
		
				// Embeds.
		
					// Get unloaded embeds.
						a = parent.querySelectorAll('unloaded-script');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Create replacement script tag.
								x = document.createElement('script');
		
							// Set "loaded" data attribute (so we can unload this element later).
								x.setAttribute('data-loaded', '');
		
							// Set "src" attribute (if present).
								if (a[i].getAttribute('src'))
									x.setAttribute('src', a[i].getAttribute('src'));
		
							// Set text content (if present).
								if (a[i].textContent)
									x.textContent = a[i].textContent;
		
							// Replace.
								a[i].replaceWith(x);
		
						}
		
				// Everything else.
		
					// Create "loadelements" event.
						x = new Event('loadelements');
		
					// Get unloaded elements.
						a = parent.querySelectorAll('[data-unloaded]');
		
					// Step through list.
						a.forEach((element) => {
		
							// Clear attribute.
								element.removeAttribute('data-unloaded');
		
							// Dispatch event.
								element.dispatchEvent(x);
		
						});
		
			},
			unloadElements = function(parent) {
		
				var a, e, x, i;
		
				// IFRAMEs.
		
					// Get list of loaded IFRAMEs.
						a = parent.querySelectorAll('iframe[data-src=""]');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Don't unload? Skip.
								if (a[i].dataset.srcUnload === '0')
									continue;
		
							// Mark as unloaded.
		
								// IFRAME was previously loaded by loadElements()? Use initialSrc.
									if ('initialSrc' in a[i].dataset)
										a[i].dataset.src = a[i].dataset.initialSrc;
		
								// Otherwise, just use src.
									else
										a[i].dataset.src = a[i].src;
		
							// Unload.
								a[i].contentWindow.location.replace('about:blank');
		
						}
		
				// Video.
		
					// Get list of videos.
						a = parent.querySelectorAll('video');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Pause if playing.
								if (!a[i].paused)
									a[i].pause();
		
						}
		
				// Autofocus.
		
					// Get focused element.
						e = $(':focus');
		
					// Found? Blur.
						if (e)
							e.blur();
		
				// Embeds.
				// NOTE: Disabled for now. May want to bring this back later.
				/*
		
					// Get loaded embeds.
						a = parent.querySelectorAll('script[data-loaded]');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Create replacement unloaded-script tag.
								x = document.createElement('unloaded-script');
		
							// Set "src" attribute (if present).
								if (a[i].getAttribute('src'))
									x.setAttribute('src', a[i].getAttribute('src'));
		
							// Set text content (if present).
								if (a[i].textContent)
									x.textContent = a[i].textContent;
		
							// Replace.
								a[i].replaceWith(x);
		
						}
		
				*/
		
			};
		
			// Expose scrollToElement.
				window._scrollToTop = scrollToTop;
	
	// "On Load" animation.
		// Create load handler.
			var loadHandler = function() {
				setTimeout(function() {
		
					// Unmark as loading.
						$body.classList.remove('is-loading');
		
					// Mark as playing.
						$body.classList.add('is-playing');
		
					// Wait for animation complete.
						setTimeout(function() {
		
							// Unmark as playing.
								$body.classList.remove('is-playing');
		
							// Mark as ready.
								$body.classList.add('is-ready');
		
						}, 1000);
		
				}, 100);
			};
		
		// Load event.
			on('load', loadHandler);
	
	// Sections.
		(function() {
		
			var initialSection, initialScrollPoint, initialId,
				header, footer, name, hideHeader, hideFooter, disableAutoScroll,
				h, e, ee, k,
				locked = false,
				title = document.title,
				scrollPointParent = function(target) {
		
					while (target) {
		
						if (target.parentElement
						&&	target.parentElement.tagName == 'SECTION')
							break;
		
						target = target.parentElement;
		
					}
		
					return target;
		
				},
				scrollPointSpeed = function(scrollPoint) {
		
					let x = parseInt(scrollPoint.dataset.scrollSpeed);
		
					switch (x) {
		
						case 5:
							return 250;
		
						case 4:
							return 500;
		
						case 3:
							return 750;
		
						case 2:
							return 1000;
		
						case 1:
							return 1250;
		
						default:
							break;
		
					}
		
					return 750;
		
				},
				doNextScrollPoint = function(event) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find next scroll point.
						while (e && e.nextElementSibling) {
		
							e = e.nextElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
								break;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doPreviousScrollPoint = function(e) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find previous scroll point.
						while (e && e.previousElementSibling) {
		
							e = e.previousElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
								break;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doFirstScrollPoint = function(e) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find first scroll point.
						while (e && e.previousElementSibling) {
		
							e = e.previousElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doLastScrollPoint = function(e) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find last scroll point.
						while (e && e.nextElementSibling) {
		
							e = e.nextElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doNextSection = function() {
		
					var section;
		
					section = $('#main > .inner > section.active').nextElementSibling;
		
					if (!section || section.tagName != 'SECTION')
						return;
		
					if (section.id) {
						location.href = '#' + section.id.replace(/-section$/, '');
					}
		
				},
				doPreviousSection = function() {
		
					var section;
		
					section = $('#main > .inner > section.active').previousElementSibling;
		
					if (!section || section.tagName != 'SECTION')
						return;
		
					if (section.id) {
						location.href = '#' + (section.matches(':first-child') ? '' : section.id.replace(/-section$/, ''));
					}
		
				},
				doFirstSection = function() {
		
					var section;
		
					section = $('#main > .inner > section:first-of-type');
		
					if (!section || section.tagName != 'SECTION')
						return;
		
					if (section.id) {
						location.href = '#' + section.id.replace(/-section$/, '');
					}
		
				},
				doLastSection = function() {
		
					var section;
		
					section = $('#main > .inner > section:last-of-type');
		
					if (!section || section.tagName != 'SECTION')
						return;
		
					if (section.id) {
						location.href = '#' + section.id.replace(/-section$/, '');
					}
		
				},
				resetSectionChangeElements = function(section) {
		
					var ee, e, x;
		
					// Get elements with data-reset-on-section-change attribute.
						ee = section.querySelectorAll('[data-reset-on-section-change="1"]');
		
					// Step through elements.
						for (e of ee) {
		
							// Determine type.
								x = e ? e.tagName : null;
		
								switch (x) {
		
									case 'FORM':
		
										// Reset.
											e.reset();
		
										break;
		
									default:
										break;
		
								}
		
						}
		
				},
				activateSection = function(section, scrollPoint) {
		
					var sectionHeight, currentSection, currentSectionHeight,
						name, hideHeader, hideFooter, disableAutoScroll,
						ee, k;
		
					// Section already active?
						if (!section.classList.contains('inactive')) {
		
							// Get options.
								name = (section && section.id ? section.id.replace(/-section$/, '') : null);
								disableAutoScroll = name ? ((name in sections) && ('disableAutoScroll' in sections[name]) && sections[name].disableAutoScroll) : false;
		
							// Scroll to scroll point (if applicable).
								if (scrollPoint)
									scrollToElement(scrollPoint, 'smooth', scrollPointSpeed(scrollPoint));
		
							// Otherwise, just scroll to top (if not disabled for this section).
								else if (!disableAutoScroll)
									scrollToElement(null);
		
							// Bail.
								return false;
		
						}
		
					// Otherwise, activate it.
						else {
		
							// Lock.
								locked = true;
		
							// Clear index URL hash.
								if (location.hash == '#home')
									history.replaceState(null, null, '#');
		
							// Get options.
								name = (section && section.id ? section.id.replace(/-section$/, '') : null);
								hideHeader = name ? ((name in sections) && ('hideHeader' in sections[name]) && sections[name].hideHeader) : false;
								hideFooter = name ? ((name in sections) && ('hideFooter' in sections[name]) && sections[name].hideFooter) : false;
								disableAutoScroll = name ? ((name in sections) && ('disableAutoScroll' in sections[name]) && sections[name].disableAutoScroll) : false;
		
							// Deactivate current section.
		
								// Hide header and/or footer (if necessary).
		
									// Header.
										if (header && hideHeader) {
		
											header.classList.add('hidden');
											header.style.display = 'none';
		
										}
		
									// Footer.
										if (footer && hideFooter) {
		
											footer.classList.add('hidden');
											footer.style.display = 'none';
		
										}
		
								// Deactivate.
									currentSection = $('#main > .inner > section:not(.inactive)');
									currentSection.classList.add('inactive');
									currentSection.classList.remove('active');
									currentSection.style.display = 'none';
		
								// Reset title.
									document.title = title;
		
								// Unload elements.
									unloadElements(currentSection);
		
								// Reset section change elements.
									resetSectionChangeElements(currentSection);
		
								// Clear timeout (if present).
									clearTimeout(window._sectionTimeoutId);
		
							// Activate target section.
		
								// Show header and/or footer (if necessary).
		
									// Header.
										if (header && !hideHeader) {
		
											header.style.display = '';
											header.classList.remove('hidden');
		
										}
		
									// Footer.
										if (footer && !hideFooter) {
		
											footer.style.display = '';
											footer.classList.remove('hidden');
		
										}
		
								// Activate.
									section.classList.remove('inactive');
									section.classList.add('active');
									section.style.display = '';
		
							// Trigger 'resize' event.
								trigger('resize');
		
							// Update title.
								if (section.dataset.title)
									document.title = section.dataset.title + ' - ' + title;
		
							// Load elements.
								loadElements(section);
		
							// Scroll to scroll point (if applicable).
								if (scrollPoint)
									scrollToElement(scrollPoint, 'instant');
		
							// Otherwise, just scroll to top (if not disabled for this section).
								else if (!disableAutoScroll)
									scrollToElement(null, 'instant');
		
							// Unlock.
								locked = false;
		
						}
		
				},
				sections = {};
		
			// Expose doNextScrollPoint, doPreviousScrollPoint, doFirstScrollPoint, doLastScrollPoint.
				window._nextScrollPoint = doNextScrollPoint;
				window._previousScrollPoint = doPreviousScrollPoint;
				window._firstScrollPoint = doFirstScrollPoint;
				window._lastScrollPoint = doLastScrollPoint;
		
			// Expose doNextSection, doPreviousSection, doFirstSection, doLastSection.
				window._nextSection = doNextSection;
				window._previousSection = doPreviousSection;
				window._firstSection = doFirstSection;
				window._lastSection = doLastSection;
		
			// Override exposed scrollToTop.
				window._scrollToTop = function() {
		
					var section, id;
		
					// Scroll to top.
						scrollToElement(null);
		
					// Section active?
						if (!!(section = $('section.active'))) {
		
							// Get name.
								if (section.id) {
									id = section.id.replace(/-section$/, '');
		
									// Index section? Clear.
										if (id == 'home')
											id = '';
		
									// Reset hash to section name (via new state).
										history.pushState(null, null, '#' + id);
								}
		
						}
		
				};
		
			// Initialize.
		
				// Set scroll restoration to manual.
					if ('scrollRestoration' in history)
						history.scrollRestoration = 'manual';
		
				// Header, footer.
					header = $('#header');
					footer = $('#footer');
		
				// Show initial section.
		
					// Determine target.
						h = thisHash();
		
						// Contains invalid characters? Might be a third-party hashbang, so ignore it.
							if (h
							&&	!h.match(/^[a-zA-Z0-9\-]+$/))
								h = null;
		
						// Scroll point.
							if (e = $('[data-scroll-id="' + h + '"]')) {
		
								initialScrollPoint = e;
								initialSection = initialScrollPoint.parentElement;
								if (initialSection) {
									initialId = initialSection.id;
								}
		
							}
		
						// Section.
							else if (e = $('#' + (h ? h : 'home') + '-section')) {
		
								initialScrollPoint = null;
								initialSection = e;
								if (initialSection) {
									initialId = initialSection.id;
								}
		
							}
		
						// Missing initial section?
							if (!initialSection) {
		
								// Default to index.
									initialScrollPoint = null;
									initialSection = $('#' + 'home' + '-section');
									
									// If home-section doesn't exist, skip section-based functionality
									if (initialSection) {
										initialId = initialSection.id;
									} else {
										initialId = null;
									}
		
								// Clear index URL hash.
									history.replaceState(undefined, undefined, '#');
		
							}
		
					// Get options.
						name = (h ? h : 'home');
						hideHeader = name ? ((name in sections) && ('hideHeader' in sections[name]) && sections[name].hideHeader) : false;
						hideFooter = name ? ((name in sections) && ('hideFooter' in sections[name]) && sections[name].hideFooter) : false;
						disableAutoScroll = name ? ((name in sections) && ('disableAutoScroll' in sections[name]) && sections[name].disableAutoScroll) : false;
		
					// Deactivate all sections (except initial).
		
						// Initially hide header and/or footer (if necessary).
		
							// Header.
								if (header && hideHeader) {
		
									header.classList.add('hidden');
									header.style.display = 'none';
		
								}
		
							// Footer.
								if (footer && hideFooter) {
		
									footer.classList.add('hidden');
									footer.style.display = 'none';
		
								}
		
						// Deactivate.
							ee = $$('#main > .inner > section:not([id="' + initialId + '"])');
		
							for (k = 0; k < ee.length; k++) {
		
								ee[k].className = 'inactive';
								ee[k].style.display = 'none';
		
							}
		
					// Activate initial section.
						initialSection.classList.add('active');
		
					// Add ready event.
						ready.add(() => {
		
							// Update title.
								if (initialSection.dataset.title)
									document.title = initialSection.dataset.title + ' - ' + title;
		
							// Load elements.
								loadElements(initialSection);
		
								if (header)
									loadElements(header);
		
								if (footer)
									loadElements(footer);
		
							// Scroll to top (if not disabled for this section).
								if (!disableAutoScroll)
									scrollToElement(null, 'instant');
		
						});
		
				// Load event.
					on('load', function() {
		
						// Scroll to initial scroll point (if applicable).
					 		if (initialScrollPoint)
								scrollToElement(initialScrollPoint, 'instant');
		
					});
		
			// Hashchange event.
				on('hashchange', function(event) {
		
					var section, scrollPoint,
						h, e;
		
					// Lock.
						if (locked)
							return false;
		
					// Determine target.
						h = thisHash();
		
						// Contains invalid characters? Might be a third-party hashbang, so ignore it.
							if (h
							&&	!h.match(/^[a-zA-Z0-9\-]+$/))
								return false;
		
						// Scroll point.
							if (e = $('[data-scroll-id="' + h + '"]')) {
		
								scrollPoint = e;
								section = scrollPoint.parentElement;
		
							}
		
						// Section.
							else if (e = $('#' + (h ? h : 'home') + '-section')) {
		
								scrollPoint = null;
								section = e;
		
							}
		
						// Anything else.
							else {
		
								// Default to index.
									scrollPoint = null;
									section = $('#' + 'home' + '-section');
		
								// Clear index URL hash.
									history.replaceState(undefined, undefined, '#');
		
							}
		
					// No section? Bail.
						if (!section)
							return false;
		
					// Activate section.
						activateSection(section, scrollPoint);
		
					return false;
		
				});
		
				// Hack: Allow hashchange to trigger on click even if the target's href matches the current hash.
					on('click', function(event) {
		
						var t = event.target,
							tagName = t.tagName.toUpperCase(),
							scrollPoint, section;
		
						// Find real target.
							switch (tagName) {
		
								case 'IMG':
								case 'SVG':
								case 'USE':
								case 'U':
								case 'STRONG':
								case 'EM':
								case 'CODE':
								case 'S':
								case 'MARK':
								case 'SPAN':
		
									// Find ancestor anchor tag.
										while ( !!(t = t.parentElement) )
											if (t.tagName == 'A')
												break;
		
									// Not found? Bail.
										if (!t)
											return;
		
									break;
		
								default:
									break;
		
							}
		
						// Target is an anchor *and* its href is a hash?
							if (t.tagName == 'A'
							&&	t.getAttribute('href') !== null
							&&	t.getAttribute('href').substr(0, 1) == '#') {
		
								// Hash matches an invisible scroll point?
									if (!!(scrollPoint = $('[data-scroll-id="' + t.hash.substr(1) + '"][data-scroll-invisible="1"]'))) {
		
										// Prevent default.
											event.preventDefault();
		
										// Get section.
											section = scrollPoint.parentElement;
		
										// Section is inactive?
											if (section.classList.contains('inactive')) {
		
												// Reset hash to section name (via new state).
													if (section.id) {
														history.pushState(null, null, '#' + section.id.replace(/-section$/, ''));
													}
		
												// Activate section.
													activateSection(section, scrollPoint);
		
											}
		
										// Otherwise ...
											else {
		
												// Scroll to scroll point.
													scrollToElement(scrollPoint, 'smooth', scrollPointSpeed(scrollPoint));
		
											}
		
									}
		
								// Hash matches the current hash?
									else if (t.hash == window.location.hash) {
		
										// Prevent default.
											event.preventDefault();
		
										// Replace state with '#'.
											history.replaceState(undefined, undefined, '#');
		
										// Replace location with target hash.
											location.replace(t.hash);
		
									}
		
							}
		
					});
		
		})();
	
	// Browser hacks.
		// Init.
			var style, sheet, rule;
		
			// Create <style> element.
				style = document.createElement('style');
				style.appendChild(document.createTextNode(''));
				document.head.appendChild(style);
		
			// Get sheet.
				sheet = style.sheet;
		
		// Mobile.
			if (client.mobile) {
		
				// Prevent overscrolling on Safari/other mobile browsers.
				// 'vh' units don't factor in the heights of various browser UI elements so our page ends up being
				// a lot taller than it needs to be (resulting in overscroll and issues with vertical centering).
					(function() {
		
						// Lsd units available?
							if (client.flags.lsdUnits) {
		
								document.documentElement.style.setProperty('--viewport-height', '100svh');
								document.documentElement.style.setProperty('--background-height', '100lvh');
		
							}
		
						// Otherwise, use innerHeight hack.
							else {
		
								var f = function() {
									document.documentElement.style.setProperty('--viewport-height', window.innerHeight + 'px');
									document.documentElement.style.setProperty('--background-height', (window.innerHeight + 250) + 'px');
								};
		
								on('load', f);
								on('orientationchange', function() {
		
									// Update after brief delay.
										setTimeout(function() {
											(f)();
										}, 100);
		
								});
		
							}
		
					})();
		
			}
		
		// Android.
			if (client.os == 'android') {
		
				// Prevent background "jump" when address bar shrinks.
				// Specifically, this fix forces the background pseudoelement to a fixed height based on the physical
				// screen size instead of relying on "vh" (which is subject to change when the scrollbar shrinks/grows).
					(function() {
		
						// Insert and get rule.
							sheet.insertRule('body::after { }', 0);
							rule = sheet.cssRules[0];
		
						// Event.
							var f = function() {
								rule.style.cssText = 'height: ' + (Math.max(screen.width, screen.height)) + 'px';
							};
		
							on('load', f);
							on('orientationchange', f);
							on('touchmove', f);
		
					})();
		
				// Apply "is-touch" class to body.
					$body.classList.add('is-touch');
		
			}
		
		// iOS.
			else if (client.os == 'ios') {
		
				// <=11: Prevent white bar below background when address bar shrinks.
				// For some reason, simply forcing GPU acceleration on the background pseudoelement fixes this.
					if (client.osVersion <= 11)
						(function() {
		
							// Insert and get rule.
								sheet.insertRule('body::after { }', 0);
								rule = sheet.cssRules[0];
		
							// Set rule.
								rule.style.cssText = '-webkit-transform: scale(1.0)';
		
						})();
		
				// <=11: Prevent white bar below background when form inputs are focused.
				// Fixed-position elements seem to lose their fixed-ness when this happens, which is a problem
				// because our backgrounds fall into this category.
					if (client.osVersion <= 11)
						(function() {
		
							// Insert and get rule.
								sheet.insertRule('body.ios-focus-fix::before { }', 0);
								rule = sheet.cssRules[0];
		
							// Set rule.
								rule.style.cssText = 'height: calc(100% + 60px)';
		
							// Add event listeners.
								on('focus', function(event) {
									$body.classList.add('ios-focus-fix');
								}, true);
		
								on('blur', function(event) {
									$body.classList.remove('ios-focus-fix');
								}, true);
		
						})();
		
				// Apply "is-touch" class to body.
					$body.classList.add('is-touch');
		
			}
	
	// Scroll events.
		var scrollEvents = {
		
			/**
			 * Items.
			 * @var {array}
			 */
			items: [],
		
			/**
			 * Adds an event.
			 * @param {object} o Options.
			 */
			add: function(o) {
		
				this.items.push({
					element: o.element,
					triggerElement: (('triggerElement' in o && o.triggerElement) ? o.triggerElement : o.element),
					enter: ('enter' in o ? o.enter : null),
					leave: ('leave' in o ? o.leave : null),
					mode: ('mode' in o ? o.mode : 4),
					threshold: ('threshold' in o ? o.threshold : 0.25),
					offset: ('offset' in o ? o.offset : 0),
					initialState: ('initialState' in o ? o.initialState : null),
					state: false,
				});
		
			},
		
			/**
			 * Handler.
			 */
			handler: function() {
		
				var	height, top, bottom, scrollPad;
		
				// Determine values.
					if (client.os == 'ios') {
		
						height = document.documentElement.clientHeight;
						top = document.body.scrollTop + window.scrollY;
						bottom = top + height;
						scrollPad = 125;
		
					}
					else {
		
						height = document.documentElement.clientHeight;
						top = document.documentElement.scrollTop;
						bottom = top + height;
						scrollPad = 0;
		
					}
		
				// Step through items.
					scrollEvents.items.forEach(function(item) {
		
						var	elementTop, elementBottom, viewportTop, viewportBottom,
							bcr, pad, state, a, b;
		
						// No enter/leave handlers? Bail.
							if (!item.enter
							&&	!item.leave)
								return true;
		
						// No trigger element? Bail.
							if (!item.triggerElement)
								return true;
		
						// Trigger element not visible?
							if (item.triggerElement.offsetParent === null) {
		
								// Current state is active *and* leave handler exists?
									if (item.state == true
									&&	item.leave) {
		
										// Reset state to false.
											item.state = false;
		
										// Call it.
											(item.leave).apply(item.element);
		
										// No enter handler? Unbind leave handler (so we don't check this element again).
											if (!item.enter)
												item.leave = null;
		
									}
		
								// Bail.
									return true;
		
							}
		
						// Get element position.
							bcr = item.triggerElement.getBoundingClientRect();
							elementTop = top + Math.floor(bcr.top);
							elementBottom = elementTop + bcr.height;
		
						// Determine state.
		
							// Initial state exists?
								if (item.initialState !== null) {
		
									// Use it for this check.
										state = item.initialState;
		
									// Clear it.
										item.initialState = null;
		
								}
		
							// Otherwise, determine state from mode/position.
								else {
		
									switch (item.mode) {
		
										// Element falls within viewport.
											case 1:
											default:
		
												// State.
													state = (bottom > (elementTop - item.offset) && top < (elementBottom + item.offset));
		
												break;
		
										// Viewport midpoint falls within element.
											case 2:
		
												// Midpoint.
													a = (top + (height * 0.5));
		
												// State.
													state = (a > (elementTop - item.offset) && a < (elementBottom + item.offset));
		
												break;
		
										// Viewport midsection falls within element.
											case 3:
		
												// Upper limit (25%-).
													a = top + (height * (item.threshold));
		
													if (a - (height * 0.375) <= 0)
														a = 0;
		
												// Lower limit (-75%).
													b = top + (height * (1 - item.threshold));
		
													if (b + (height * 0.375) >= document.body.scrollHeight - scrollPad)
														b = document.body.scrollHeight + scrollPad;
		
												// State.
													state = (b > (elementTop - item.offset) && a < (elementBottom + item.offset));
		
												break;
		
										// Viewport intersects with element.
											case 4:
		
												// Calculate pad, viewport top, viewport bottom.
													pad = height * item.threshold;
													viewportTop = (top + pad);
													viewportBottom = (bottom - pad);
		
												// Compensate for elements at the very top or bottom of the page.
													if (Math.floor(top) <= pad)
														viewportTop = top;
		
													if (Math.ceil(bottom) >= (document.body.scrollHeight - pad))
														viewportBottom = bottom;
		
												// Element is smaller than viewport?
													if ((viewportBottom - viewportTop) >= (elementBottom - elementTop)) {
		
														state =	(
																(elementTop >= viewportTop && elementBottom <= viewportBottom)
															||	(elementTop >= viewportTop && elementTop <= viewportBottom)
															||	(elementBottom >= viewportTop && elementBottom <= viewportBottom)
														);
		
													}
		
												// Otherwise, viewport is smaller than element.
													else
														state =	(
																(viewportTop >= elementTop && viewportBottom <= elementBottom)
															||	(elementTop >= viewportTop && elementTop <= viewportBottom)
															||	(elementBottom >= viewportTop && elementBottom <= viewportBottom)
														);
		
												break;
		
									}
		
								}
		
						// State changed?
							if (state != item.state) {
		
								// Update state.
									item.state = state;
		
								// Call handler.
									if (item.state) {
		
										// Enter handler exists?
											if (item.enter) {
		
												// Call it.
													(item.enter).apply(item.element);
		
												// No leave handler? Unbind enter handler (so we don't check this element again).
													if (!item.leave)
														item.enter = null;
		
											}
		
									}
									else {
		
										// Leave handler exists?
											if (item.leave) {
		
												// Call it.
													(item.leave).apply(item.element);
		
												// No enter handler? Unbind leave handler (so we don't check this element again).
													if (!item.enter)
														item.leave = null;
		
											}
		
									}
		
							}
		
					});
		
			},
		
			/**
			 * Initializes scroll events.
			 */
			init: function() {
		
				// Bind handler to events.
					on('load', this.handler);
					on('resize', this.handler);
					on('scroll', this.handler);
		
				// Do initial handler call.
					(this.handler)();
		
			}
		};
		
		// Initialize.
			scrollEvents.init();
	
	// Deferred.
		(function() {
		
			var items = $$('.deferred'),
				loadHandler, enterHandler;
		
			// Handlers.
		
				/**
				 * "On Load" handler.
				 */
				loadHandler = function() {
		
					var i = this,
						p = this.parentElement,
						duration = 375;
		
					// Not "done" yet? Bail.
						if (i.dataset.src !== 'done')
							return;
		
					// Image loaded faster than expected? Reduce transition duration.
						if (Date.now() - i._startLoad < duration)
							duration = 175;
		
					// Set transition duration.
						i.style.transitionDuration = (duration / 1000.00) + 's';
		
					// Show image.
						p.classList.remove('loading');
						i.style.opacity = 1;
		
						setTimeout(function() {
		
							// Clear background image.
								i.style.backgroundImage = 'none';
		
							// Clear transition properties.
								i.style.transitionProperty = '';
								i.style.transitionTimingFunction = '';
								i.style.transitionDuration = '';
		
						}, duration);
		
				};
		
				/**
				 * "On Enter" handler.
				 */
				enterHandler = function() {
		
					var	i = this,
						p = this.parentElement,
						src;
		
					// Get src, mark as "done".
						src = i.dataset.src;
						i.dataset.src = 'done';
		
					// Mark parent as loading.
						p.classList.add('loading');
		
					// Swap placeholder for real image src.
						i._startLoad = Date.now();
						i.src = src;
		
				};
		
			// Initialize items.
				items.forEach(function(p) {
		
					var i = p.firstElementChild;
		
					// Set parent to placeholder.
						if (!p.classList.contains('enclosed')) {
		
							p.style.backgroundImage = 'url(' + i.src + ')';
							p.style.backgroundSize = '100% 100%';
							p.style.backgroundPosition = 'top left';
							p.style.backgroundRepeat = 'no-repeat';
		
						}
		
					// Hide image.
						i.style.opacity = 0;
		
					// Set transition properties.
						i.style.transitionProperty = 'opacity';
						i.style.transitionTimingFunction = 'ease-in-out';
		
					// Load event.
						i.addEventListener('load', loadHandler);
		
					// Add to scroll events.
						scrollEvents.add({
							element: i,
							enter: enterHandler,
							offset: 250,
						});
		
				});
		
		})();
	
	// "On Visible" animation.
		var onvisible = {
		
			/**
			 * Effects.
			 * @var {object}
			 */
			effects: {
				'blur-in': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'filter ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.opacity = 0;
						this.style.filter = 'blur(' + (0.25 * intensity) + 'rem)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.filter = 'none';
					},
				},
				'zoom-in': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transform = 'scale(' + (1 - ((alt ? 0.25 : 0.05) * intensity)) + ')';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'zoom-out': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transform = 'scale(' + (1 + ((alt ? 0.25 : 0.05) * intensity)) + ')';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'slide-left': {
					type: 'transition',
					transition: function (speed, delay) {
						return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function() {
						this.style.transform = 'translateX(100vw)';
					},
					play: function() {
						this.style.transform = 'none';
					},
				},
				'slide-right': {
					type: 'transition',
					transition: function (speed, delay) {
						return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function() {
						this.style.transform = 'translateX(-100vw)';
					},
					play: function() {
						this.style.transform = 'none';
					},
				},
				'flip-forward': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transformOrigin = '50% 50%';
						this.style.transform = 'perspective(1000px) rotateX(' + ((alt ? 45 : 15) * intensity) + 'deg)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'flip-backward': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transformOrigin = '50% 50%';
						this.style.transform = 'perspective(1000px) rotateX(' + ((alt ? -45 : -15) * intensity) + 'deg)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'flip-left': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transformOrigin = '50% 50%';
						this.style.transform = 'perspective(1000px) rotateY(' + ((alt ? 45 : 15) * intensity) + 'deg)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'flip-right': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transformOrigin = '50% 50%';
						this.style.transform = 'perspective(1000px) rotateY(' + ((alt ? -45 : -15) * intensity) + 'deg)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'tilt-left': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transform = 'rotate(' + ((alt ? 45 : 5) * intensity) + 'deg)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'tilt-right': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transform = 'rotate(' + ((alt ? -45 : -5) * intensity) + 'deg)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'fade-right': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.opacity = 0;
						this.style.transform = 'translateX(' + (-1.5 * intensity) + 'rem)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'fade-left': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.opacity = 0;
						this.style.transform = 'translateX(' + (1.5 * intensity) + 'rem)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'fade-down': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.opacity = 0;
						this.style.transform = 'translateY(' + (-1.5 * intensity) + 'rem)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'fade-up': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.opacity = 0;
						this.style.transform = 'translateY(' + (1.5 * intensity) + 'rem)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'fade-in': {
					type: 'transition',
					transition: function (speed, delay) {
						return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function() {
						this.style.opacity = 0;
					},
					play: function() {
						this.style.opacity = 1;
					},
				},
				'fade-in-background': {
					type: 'manual',
					rewind: function() {
		
						this.style.removeProperty('--onvisible-delay');
						this.style.removeProperty('--onvisible-background-color');
		
					},
					play: function(speed, delay) {
		
						this.style.setProperty('--onvisible-speed', speed + 's');
		
						if (delay)
							this.style.setProperty('--onvisible-delay', delay + 's');
		
						this.style.setProperty('--onvisible-background-color', 'rgba(0,0,0,0.001)');
		
					},
				},
				'zoom-in-image': {
					type: 'transition',
					target: 'img',
					transition: function (speed, delay) {
						return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function() {
						this.style.transform = 'scale(1)';
					},
					play: function(intensity) {
						this.style.transform = 'scale(' + (1 + (0.1 * intensity)) + ')';
					},
				},
				'zoom-out-image': {
					type: 'transition',
					target: 'img',
					transition: function (speed, delay) {
						return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.transform = 'scale(' + (1 + (0.1 * intensity)) + ')';
					},
					play: function() {
						this.style.transform = 'none';
					},
				},
				'focus-image': {
					type: 'transition',
					target: 'img',
					transition: function (speed, delay) {
						return  'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'filter ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.transform = 'scale(' + (1 + (0.05 * intensity)) + ')';
						this.style.filter = 'blur(' + (0.25 * intensity) + 'rem)';
					},
					play: function(intensity) {
						this.style.transform = 'none';
						this.style.filter = 'none';
					},
				},
				'wipe-up': {
					type: 'animate',
					keyframes: function(intensity) {
		
						return [
							{
								maskSize: '100% 0%',
								maskImage: 'linear-gradient(90deg, black 100%, transparent 100%)',
							},
							{
								maskSize: '110% 110%',
								maskImage: 'linear-gradient(90deg, black 100%, transparent 100%)',
							},
						];
		
					},
					options: function(speed) {
		
						return {
							duration: speed,
							iterations: 1,
							easing: 'ease',
						};
		
					},
					rewind: function() {
						this.style.opacity = 0;
						this.style.maskComposite = 'exclude';
						this.style.maskRepeat = 'no-repeat';
						this.style.maskPosition = '0% 100%';
					},
					play: function() {
						this.style.opacity = 1;
					},
				},
				'wipe-down': {
					type: 'animate',
					keyframes: function(intensity) {
		
						return [
							{
								maskSize: '100% 0%',
								maskImage: 'linear-gradient(90deg, black 100%, transparent 100%)',
							},
							{
								maskSize: '110% 110%',
								maskImage: 'linear-gradient(90deg, black 100%, transparent 100%)',
							},
						];
		
					},
					options: function(speed) {
		
						return {
							duration: speed,
							iterations: 1,
							easing: 'ease',
						};
		
					},
					rewind: function() {
						this.style.opacity = 0;
						this.style.maskComposite = 'exclude';
						this.style.maskRepeat = 'no-repeat';
						this.style.maskPosition = '0% 0%';
					},
					play: function() {
						this.style.opacity = 1;
					},
				},
				'wipe-left': {
					type: 'animate',
					keyframes: function(intensity) {
		
						return [
							{
								maskSize: '0% 100%',
								maskImage: 'linear-gradient(90deg, black 100%, transparent 100%)',
							},
							{
								maskSize: '110% 110%',
								maskImage: 'linear-gradient(90deg, black 100%, transparent 100%)',
							},
						];
		
					},
					options: function(speed) {
		
						return {
							duration: speed,
							iterations: 1,
							easing: 'ease',
						};
		
					},
					rewind: function() {
						this.style.opacity = 0;
						this.style.maskComposite = 'exclude';
						this.style.maskRepeat = 'no-repeat';
						this.style.maskPosition = '100% 0%';
					},
					play: function() {
						this.style.opacity = 1;
					},
				},
				'wipe-right': {
					type: 'animate',
					keyframes: function(intensity) {
		
						return [
							{
								maskSize: '0% 100%',
								maskImage: 'linear-gradient(90deg, black 100%, transparent 100%)',
							},
							{
								maskSize: '110% 110%',
								maskImage: 'linear-gradient(90deg, black 100%, transparent 100%)',
							},
						];
		
					},
					options: function(speed) {
		
						return {
							duration: speed,
							iterations: 1,
							easing: 'ease',
						};
		
					},
					rewind: function() {
						this.style.opacity = 0;
						this.style.maskComposite = 'exclude';
						this.style.maskRepeat = 'no-repeat';
						this.style.maskPosition = '0% 0%';
					},
					play: function() {
						this.style.opacity = 1;
					},
				},
				'wipe-diagonal': {
					type: 'animate',
					keyframes: function(intensity) {
		
						return [
							{
								maskSize: '0% 0%',
								maskImage: 'linear-gradient(45deg, black 50%, transparent 50%)',
							},
							{
								maskSize: '220% 220%',
								maskImage: 'linear-gradient(45deg, black 50%, transparent 50%)',
							},
						];
		
					},
					options: function(speed) {
		
						return {
							duration: speed,
							iterations: 1,
							easing: 'ease',
						};
		
					},
					rewind: function() {
						this.style.opacity = 0;
						this.style.maskComposite = 'exclude';
						this.style.maskRepeat = 'no-repeat';
						this.style.maskPosition = '0% 100%';
					},
					play: function() {
						this.style.opacity = 1;
					},
				},
				'wipe-reverse-diagonal': {
					type: 'animate',
					keyframes: function(intensity) {
		
						return [
							{
								maskSize: '0% 0%',
								maskImage: 'linear-gradient(135deg, transparent 50%, black 50%)',
							},
							{
								maskSize: '220% 220%',
								maskImage: 'linear-gradient(135deg, transparent 50%, black 50%)',
							},
						];
		
					},
					options: function(speed) {
		
						return {
							duration: speed,
							iterations: 1,
							easing: 'ease',
						};
		
					},
					rewind: function() {
						this.style.opacity = 0;
						this.style.maskComposite = 'exclude';
						this.style.maskRepeat = 'no-repeat';
						this.style.maskPosition = '100% 100%';
					},
					play: function() {
						this.style.opacity = 1;
					},
				},
				'pop-in': {
					type: 'animate',
					keyframes: function(intensity) {
		
						let diff = (intensity + 1) * 0.025;
		
						return [
							{
								opacity: 0,
								transform: 'scale(' + (1 - diff) + ')',
							},
							{
								opacity: 1,
								transform: 'scale(' + (1 + diff) + ')',
							},
							{
								opacity: 1,
								transform: 'scale(' + (1 - (diff * 0.25)) + ')',
								offset: 0.9,
							},
							{
								opacity: 1,
								transform: 'scale(1)',
							}
						];
		
					},
					options: function(speed) {
		
						return {
							duration: speed,
							iterations: 1,
						};
		
					},
					rewind: function() {
						this.style.opacity = 0;
					},
					play: function() {
						this.style.opacity = 1;
					},
				},
				'bounce-up': {
					type: 'animate',
					keyframes: function(intensity) {
		
						let diff = (intensity + 1) * 0.075;
		
						return [
							{
								opacity: 0,
								transform: 'translateY(' + diff + 'rem)',
							},
							{
								opacity: 1,
								transform: 'translateY(' + (-1 * diff) + 'rem)',
							},
							{
								opacity: 1,
								transform: 'translateY(' + (diff * 0.25) + 'rem)',
								offset: 0.9,
							},
							{
								opacity: 1,
								transform: 'translateY(0)',
							}
						];
		
					},
					options: function(speed) {
		
						return {
							duration: speed,
							iterations: 1,
						};
		
					},
					rewind: function() {
						this.style.opacity = 0;
					},
					play: function() {
						this.style.opacity = 1;
					},
				},
				'bounce-down': {
					type: 'animate',
					keyframes: function(intensity) {
		
						let diff = (intensity + 1) * 0.075;
		
						return [
							{
								opacity: 0,
								transform: 'translateY(' + (-1 * diff) + 'rem)',
							},
							{
								opacity: 1,
								transform: 'translateY(' + diff + 'rem)',
							},
							{
								opacity: 1,
								transform: 'translateY(' + (-1 * (diff * 0.25)) + 'rem)',
								offset: 0.9,
							},
							{
								opacity: 1,
								transform: 'translateY(0)',
							}
						];
		
					},
					options: function(speed) {
		
						return {
							duration: speed,
							iterations: 1,
						};
		
					},
					rewind: function() {
						this.style.opacity = 0;
					},
					play: function() {
						this.style.opacity = 1;
					},
				},
				'bounce-left': {
					type: 'animate',
					keyframes: function(intensity) {
		
						let diff = (intensity + 1) * 0.075;
		
						return [
							{
								opacity: 0,
								transform: 'translateX(' + diff + 'rem)',
							},
							{
								opacity: 1,
								transform: 'translateX(' + (-1 * diff) + 'rem)',
							},
							{
								opacity: 1,
								transform: 'translateX(' + (diff * 0.25) + 'rem)',
								offset: 0.9,
							},
							{
								opacity: 1,
								transform: 'translateX(0)',
							}
						];
		
					},
					options: function(speed) {
		
						return {
							duration: speed,
							iterations: 1,
						};
		
					},
					rewind: function() {
						this.style.opacity = 0;
					},
					play: function() {
						this.style.opacity = 1;
					},
				},
				'bounce-right': {
					type: 'animate',
					keyframes: function(intensity) {
		
						let diff = (intensity + 1) * 0.075;
		
						return [
							{
								opacity: 0,
								transform: 'translateX(' + (-1 * diff) + 'rem)',
							},
							{
								opacity: 1,
								transform: 'translateX(' + diff + 'rem)',
							},
							{
								opacity: 1,
								transform: 'translateX(' + (-1 * (diff * 0.25)) + 'rem)',
								offset: 0.9,
							},
							{
								opacity: 1,
								transform: 'translateX(0)',
							}
						];
		
					},
					options: function(speed) {
		
						return {
							duration: speed,
							iterations: 1,
						};
		
					},
					rewind: function() {
						this.style.opacity = 0;
					},
					play: function() {
						this.style.opacity = 1;
					},
				},
			},
		
			/**
			 * Regex.
			 * @var {RegExp}
			 */
			regex: new RegExp('([^\\s]+)', 'g'),
		
			/**
			 * Adds one or more animatable elements.
			 * @param {string} selector Selector.
			 * @param {object} settings Settings.
			 */
			add: function(selector, settings) {
		
				var	_this = this,
					style = settings.style in this.effects ? settings.style : 'fade',
					speed = parseInt('speed' in settings ? settings.speed : 0),
					intensity = parseInt('intensity' in settings ? settings.intensity : 5),
					delay = parseInt('delay' in settings ? settings.delay : 0),
					replay = 'replay' in settings ? settings.replay : false,
					stagger = 'stagger' in settings ? (parseInt(settings.stagger) >= 0 ? parseInt(settings.stagger) : false) : false,
					staggerOrder = 'staggerOrder' in settings ? settings.staggerOrder : 'default',
					staggerSelector = 'staggerSelector' in settings ? settings.staggerSelector : null,
					threshold = parseInt('threshold' in settings ? settings.threshold : 3),
					state = 'state' in settings ? settings.state : null,
					effect = this.effects[style],
					enter, leave, scrollEventThreshold;
		
				// Determine scroll event threshold.
					switch (threshold) {
		
						case 1:
							scrollEventThreshold = 0;
							break;
		
						case 2:
							scrollEventThreshold = 0.125;
							break;
		
						default:
						case 3:
							scrollEventThreshold = 0.25;
							break;
		
						case 4:
							scrollEventThreshold = 0.375;
							break;
		
						case 5:
							scrollEventThreshold = 0.475;
							break;
		
					}
		
				// Determine effect type.
					switch (effect.type) {
		
						default:
						case 'transition':
		
							// Scale intensity.
								intensity = ((intensity / 10) * 1.75) + 0.25;
		
							// Build enter handler.
								enter = function(children, staggerDelay=0) {
		
									var _this = this,
										transitionOrig;
		
									// Target provided? Use it instead of element.
										if (effect.target)
											_this = this.querySelector(effect.target);
		
									// Save original transition.
										transitionOrig = _this.style.transition;
		
									// Apply temporary styles.
										_this.style.setProperty('backface-visibility', 'hidden');
		
									// Apply transition.
										_this.style.transition = effect.transition.apply(_this, [ speed / 1000, (delay + staggerDelay) / 1000 ]);
		
									// Play.
										effect.play.apply(_this, [ intensity, !!children ]);
		
									// Delay.
										setTimeout(function() {
		
											// Remove temporary styles.
												_this.style.removeProperty('backface-visibility');
		
											// Restore original transition.
												_this.style.transition = transitionOrig;
		
										}, (speed + delay + staggerDelay) * 2);
		
								};
		
							// Build leave handler.
								leave = function(children) {
		
									var _this = this,
										transitionOrig;
		
									// Target provided? Use it instead of element.
										if (effect.target)
											_this = this.querySelector(effect.target);
		
									// Save original transition.
										transitionOrig = _this.style.transition;
		
									// Apply temporary styles.
										_this.style.setProperty('backface-visibility', 'hidden');
		
									// Apply transition.
										_this.style.transition = effect.transition.apply(_this, [ speed / 1000 ]);
		
									// Rewind.
										effect.rewind.apply(_this, [ intensity, !!children ]);
		
									// Delay.
										setTimeout(function() {
		
											// Remove temporary styles.
												_this.style.removeProperty('backface-visibility');
		
											// Restore original transition.
												_this.style.transition = transitionOrig;
		
										}, speed * 2);
		
								};
		
							break;
		
						case 'animate':
		
							// Build enter handler.
								enter = function(children, staggerDelay=0) {
		
									var _this = this,
										transitionOrig;
		
									// Target provided? Use it instead of element.
										if (effect.target)
											_this = this.querySelector(effect.target);
		
									// Delay.
										setTimeout(() => {
		
											// Call play handler on target.
												effect.play.apply(_this, [ ]);
		
											// Animate.
												_this.animate(
													effect.keyframes.apply(_this, [ intensity ]),
													effect.options.apply(_this, [ speed, delay ])
												);
		
										}, delay + staggerDelay);
		
								};
		
							// Build leave handler.
								leave = function(children) {
		
									var _this = this,
										transitionOrig;
		
									// Target provided? Use it instead of element.
										if (effect.target)
											_this = this.querySelector(effect.target);
		
									// Animate.
		
										// Create Animation object.
											let a = _this.animate(
												effect.keyframes.apply(_this, [ intensity ]),
												effect.options.apply(_this, [ speed, delay ])
											);
		
										// Play in reverse.
											a.reverse();
		
										// Add finish listener.
											a.addEventListener('finish', () => {
		
												// Call rewind handler on target.
													effect.rewind.apply(_this, [ ]);
		
											});
		
								};
		
							break;
		
						case 'manual':
		
							// Build enter handler.
								enter = function(children, staggerDelay=0) {
		
									var _this = this,
										transitionOrig;
		
									// Target provided? Use it instead of element.
										if (effect.target)
											_this = this.querySelector(effect.target);
		
									// Call play handler on target.
										effect.play.apply(_this, [ speed / 1000, (delay + staggerDelay) / 1000, intensity ]);
		
								};
		
							// Build leave handler.
								leave = function(children) {
		
									var _this = this,
										transitionOrig;
		
									// Target provided? Use it instead of element.
										if (effect.target)
											_this = this.querySelector(effect.target);
		
									// Call rewind handler on target.
										effect.rewind.apply(_this, [ intensity, !!children ]);
		
								};
		
							break;
		
					}
		
				// Step through selected elements.
					$$(selector).forEach(function(e) {
		
						var children, targetElement, triggerElement;
		
						// Stagger in use, and stagger selector is "all children"? Expand text nodes.
							if (stagger !== false
							&&	staggerSelector == ':scope > *')
								_this.expandTextNodes(e);
		
						// Get children.
							children = (stagger !== false && staggerSelector) ? e.querySelectorAll(staggerSelector) : null;
		
						// Initial rewind.
		
							// Determine target element.
								if (effect.target)
									targetElement = e.querySelector(effect.target);
								else
									targetElement = e;
		
							// Children? Rewind each individually.
								if (children)
									children.forEach(function(targetElement) {
										effect.rewind.apply(targetElement, [ intensity, true ]);
									});
		
							// Otherwise. just rewind element.
								else
									effect.rewind.apply(targetElement, [ intensity ]);
		
						// Determine trigger element.
							triggerElement = e;
		
							// Has a parent?
								if (e.parentNode) {
		
									// Parent is an onvisible trigger? Use it.
										if (e.parentNode.dataset.onvisibleTrigger)
											triggerElement = e.parentNode;
		
									// Otherwise, has a grandparent?
										else if (e.parentNode.parentNode) {
		
											// Grandparent is an onvisible trigger? Use it.
												if (e.parentNode.parentNode.dataset.onvisibleTrigger)
													triggerElement = e.parentNode.parentNode;
		
										}
		
								}
		
						// Add scroll event.
							scrollEvents.add({
								element: e,
								triggerElement: triggerElement,
								initialState: state,
								threshold: scrollEventThreshold,
								enter: children ? function() {
		
									var staggerDelay = 0,
										childHandler = function(e) {
		
											// Apply enter handler.
												enter.apply(e, [children, staggerDelay]);
		
											// Increment stagger delay.
												staggerDelay += stagger;
		
										},
										a;
		
									// Default stagger order?
										if (staggerOrder == 'default') {
		
											// Apply child handler to children.
												children.forEach(childHandler);
		
										}
		
									// Otherwise ...
										else {
		
											// Convert children to an array.
												a = Array.from(children);
		
											// Sort array based on stagger order.
												switch (staggerOrder) {
		
													case 'reverse':
		
														// Reverse array.
															a.reverse();
		
														break;
		
													case 'random':
		
														// Randomly sort array.
															a.sort(function() {
																return Math.random() - 0.5;
															});
		
														break;
		
												}
		
											// Apply child handler to array.
												a.forEach(childHandler);
		
										}
		
								} : enter,
								leave: (replay ? (children ? function() {
		
									// Step through children.
										children.forEach(function(e) {
		
											// Apply leave handler.
												leave.apply(e, [children]);
		
										});
		
								} : leave) : null),
							});
		
					});
		
			},
		
			/**
			 * Expand text nodes within an element into <text-node> elements.
			 * @param {DOMElement} e Element.
			 */
			expandTextNodes: function(e) {
		
				var s, i, w, x;
		
				// Step through child nodes.
					for (i = 0; i < e.childNodes.length; i++) {
		
						// Get child node.
							x = e.childNodes[i];
		
						// Not a text node? Skip.
							if (x.nodeType != Node.TEXT_NODE)
								continue;
		
						// Get node value.
							s = x.nodeValue;
		
						// Convert to <text-node>.
							s = s.replace(
								this.regex,
								function(x, a) {
									return '<text-node>' + escapeHtml(a) + '</text-node>';
								}
							);
		
						// Update.
		
							// Create wrapper.
								w = document.createElement('text-node');
		
							// Populate with processed text.
							// This converts our processed text into a series of new text and element nodes.
								w.innerHTML = s;
		
							// Replace original element with wrapper.
								x.replaceWith(w);
		
							// Step through wrapper's children.
								while (w.childNodes.length > 0) {
		
									// Move child after wrapper.
										w.parentNode.insertBefore(
											w.childNodes[0],
											w
										);
		
								}
		
							// Remove wrapper (now that it's no longer needed).
								w.parentNode.removeChild(w);
		
						}
		
			},
		
		};
	
	// Initialize "On Visible" animations.
		onvisible.add('.links.style4', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('.links.style7', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#links44', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#links45', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#links46', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#links47', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#links48', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#links49', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('.links.style6', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('h1.style36, h2.style36, h3.style36, p.style36', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('.icons.style2', { style: 'fade-up', speed: 1000, intensity: 1, threshold: 3, delay: 125, stagger: 125, staggerSelector: ':scope > li', state: true, replay: false });
		onvisible.add('h1.style38, h2.style38, h3.style38, p.style38', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('.icons.style3', { style: 'fade-up', speed: 1000, intensity: 1, threshold: 1, delay: 125, stagger: 125, staggerSelector: ':scope > li', state: true, replay: false });
		onvisible.add('h1.style40, h2.style40, h3.style40, p.style40', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('#image11', { style: 'fade-in', speed: 1000, intensity: 0, threshold: 1, delay: 0, state: true, replay: false });
		onvisible.add('.links.style8', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#image10', { style: 'fade-in', speed: 1000, intensity: 0, threshold: 1, delay: 0, state: true, replay: false });
		onvisible.add('.links.style5', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('h1.style16, h2.style16, h3.style16, p.style16', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('.buttons.style4', { style: 'fade-in', speed: 375, intensity: 0, threshold: 1, delay: 0, state: true, replay: false });
		onvisible.add('#text102', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('#links79', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('h1.style42, h2.style42, h3.style42, p.style42', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('h1.style23, h2.style23, h3.style23, p.style23', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('h1.style41, h2.style41, h3.style41, p.style41', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('.links.style9', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#text66', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('#text183', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('h1.style48, h2.style48, h3.style48, p.style48', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('h1.style46, h2.style46, h3.style46, p.style46', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('h1.style47, h2.style47, h3.style47, p.style47', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('h1.style49, h2.style49, h3.style49, p.style49', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('#text176', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('#links02', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#links10', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('h1.style45, h2.style45, h3.style45, p.style45', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('.links.style3', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('.buttons.style1', { style: 'zoom-in', speed: 500, intensity: 10, threshold: 1, delay: 0, state: true, replay: false });
		onvisible.add('h1.style14, h2.style14, h3.style14, p.style14', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('#text130', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('#text135', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('#text101', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('#text105', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('#text112', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('#links01', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#links28', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#links21', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#links19', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('h1.style25, h2.style25, h3.style25, p.style25', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('h1.style18, h2.style18, h3.style18, p.style18', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('h1.style4, h2.style4, h3.style4, p.style4', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('#text145', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('#links80', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#links34', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#links17', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#text23', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('#links81', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#text30', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('#links82', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#links38', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#links24', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('.links.style20', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('h1.style34, h2.style34, h3.style34, p.style34', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('#text05', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('#links03', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#links23', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#text71', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('#links85', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#links11', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#links07', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#links97', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#text166', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('#text32', { style: 'zoom-in', speed: 500, intensity: 2, threshold: 3, delay: 125, state: true, replay: false });
		onvisible.add('#links57', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
		onvisible.add('#links56', { style: 'flip-forward', speed: 1375, intensity: 5, threshold: 3, delay: 0, state: true, replay: false });
	
	// Run ready handlers.
		ready.run();

})();