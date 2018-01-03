/*
 *  jquery-boilerplate - v4.0.0
 *  A jump-start for jQuery plugins development.
 *  http://jqueryboilerplate.com
 *
 *  Made by Zeno Rocha
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "notifyLight",
			defaults = {
                            theme : "default",
                            message : "",
                            preMessage : "",
                            type : "",
                            defaultType : "info",
                            positionFixed : true,
                            positionFixedPlacementVerticle : "bottom",
                            positionFixedPlacementHorizontal : "right",
                            positionFixedPlacementSpacing : '10px',
                            autoHide : true,
                            autoHideTime : 5000,
                            closeBtn : true,
                            loop: false,
                            customClass : "",
                            debug : false,
                            onHide:function() {
                                //
                            }
                        };

		// The actual plugin constructor
		function Plugin ( element, options, container ) {
                        this.element = (element instanceof jQuery) ? element : $(element);
                        this.container = (!container) ? $('.'+pluginName) : $(container);
                        this.btnClose = '';
			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
                        this.init();
                         
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			init: function() {

				// Place initialization logic here
				// You already have access to the DOM element and
				// the options via the instance, e.g. this.element
				// and this.settings
				// you can add more functions like the one below and
				// call them like the example bellow
				if( this.element.length > 0 ) {
                                    this.beforeBuildNotification();
                                    this.buildNotification();
                                    this.doAutoHide();
                                }
			},
                        doAutoHide:function() {
                            if( this.container.length > 0 && this.settings.autoHide ) {
                                var settings = this.settings;  
                                var tmp = this.element;
                                tmp.delay( this.settings.autoHideTime ).fadeOut( function(){
                                    tmp.remove();
                                    settings.onHide();
                                });
                            }
                        },
                        beforeBuildNotification:function(){
                          if( !this.settings.message.length > 0 ) {
                              return true;
                          }
                        },
                        buildStyle:function(){
                            if( this.settings.positionFixed  ) {
                                var styleObj = { 'position':'fixed' };
                                if( this.settings.positionFixedPlacementVerticle == 'top' ) {
                                    if( this.settings.positionFixedPlacementHorizontal == 'right' ) {
                                        styleObj['top'] = this.settings.positionFixedPlacementSpacing;
                                        styleObj['right'] = this.settings.positionFixedPlacementSpacing;
                                    } else {
                                        styleObj['top'] = this.settings.positionFixedPlacementSpacing;
                                        styleObj['left'] = this.settings.positionFixedPlacementSpacing;
                                    }
                                } else {
                                    if( this.settings.positionFixedPlacementHorizontal == 'right' ) {
                                        styleObj['bottom'] = this.settings.positionFixedPlacementSpacing;
                                        styleObj['right'] = this.settings.positionFixedPlacementSpacing;
                                    } else {
                                        styleObj['bottom'] = this.settings.positionFixedPlacementSpacing;
                                        styleObj['left'] = this.settings.positionFixedPlacementSpacing;
                                    }
                                }
                                return styleObj;
                            }
                            return {};
                        },
                        buildNotification:function(){
                            var _notifyType = ['danger','success','warning','info'];
                            var notifyType = $.inArray(this.settings.type,_notifyType) ? this.settings.type : this.settings.defaultType;
                            var preMessage = this.settings.preMessage ? this.settings.preMessage : notifyType;
                            var dismissable = this.settings.closeBtn ? 'alert-dismissable' : '';
                            var dismissableBtn = this.settings.closeBtn ? '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' : '';
                            if( this.settings.closeBtn ) {
                                this.btnClose = $('<a>&times;</a>');
                                this.btnClose.attr('href','#')
                                .attr('class','#')
                                .attr('data-dismiss','alert')
                                .attr('aria-label','close');
                            }
                            
                            switch( this.settings.theme ) {
                                case 'bootstrap':
                                case 'defaults':    
                                    this.element.attr('class','JD'+pluginName+' alert fade '+dismissable+' alert-'+notifyType+'');
                                    this.element.html(dismissableBtn + '<strong>'+preMessage+'! '+this.settings.message+'</strong>');
                                    break;
                            }
                            
                            this.container.append(this.element);
                            this.element.css( this.buildStyle() );
                            this.element.addClass('in');
                            var settings = this.settings;
                            $(document).on('click','.JDnotifyLight .close',function() { settings.onHide(); } );
                        },
                        console:function(msg){
                            console.log(msg);
                        }
		} );

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
                $.notifyLight = function(options) {
                    var main = '<div class="'+pluginName+'" ></div>';
                    var selector = $( '<div></div>' );
                    if( $('body').find('.'+pluginName).length === 0 ) {
                        $('body').append(main);
                    }

                    return $.data( selector, "plugin_" + pluginName, new Plugin( selector, options, 0 ));
                };

                $.fn[ pluginName ] = function( options ) {
                        return this.each( function() {
                                if ( !$.data( this, "plugin_" + pluginName ) ) {
                                        $.data( this, "plugin_" +
                                                pluginName, new Plugin( $( '<div></div>' ), options, this ) );
                                }
                        } );
                };
                
		$(function() {
                   $(document).on("click", ".JD" + pluginName + ".alert-dismissable .close", function(e) {
                        $('.JD'+pluginName).trigger("notify-hide");
                    });
                });

} )( jQuery, window, document );