var el = element,
    doc = el.document,
    docMode = doc.documentMode || 0;

// NOTE: do NOT try maintaining a long-lived variable referencing window.PIE here at the top
// level because for some reason it isn't reliably set when it should be on subsequent attachments
// of the behavior, resulting in double loads of the JS file.

if ( !window[ 'PIE' ] && docMode < 10 ) {
    (function() {
        var queue = {},
            script;

        // Create stub PIE object
        window[ 'PIE' ] = {
            'attach': function( el ) {
                queue[ el[ 'uniqueID' ] ] = el;
            },

            'detach': function( el ) {
                delete queue[ el[ 'uniqueID' ] ];
            }
        };

        // Find script by ID
        script = doc.getElementById( 'pie-js' );

        // Find script by filename match
        if( !script ) {
            for( var i = 0; i < doc.scripts.length; i++ ) {
                if( /PIE_IE(678|9)$JSVariant$\.js/.test( doc.scripts[ i ].src ) ) {
                    script = doc.scripts[ i ];
                    break;
                }
            }
        }

        // Attach to the script load event
        if( script ) {
            script.onreadystatechange = function() {
                var PIE = window[ 'PIE' ],
                    rs = script.readyState,
                    id;
                if ( queue && ( rs === 'complete' || rs === 'loaded' ) ) {
                    if ( 'version' in PIE ) {
                        for( id in queue ) {
                            if ( queue.hasOwnProperty( id ) ) {
                                PIE[ 'attach' ]( queue[ id ] );
                            }
                        }
                        queue = 0;
                    }
                }
            };
        }
    })();
}

function init() {
    if ( doc.media !== 'print' ) { // IE strangely attaches a second copy of the behavior to elements when printing
        var PIE = window[ 'PIE' ];
        if( PIE ) {
            PIE[ 'attach' ]( el );
        }
    }
}

function cleanup() {
    if ( doc.media !== 'print' ) {
        var PIE = window[ 'PIE' ];
        if ( PIE ) {
            PIE[ 'detach' ]( el );
        }
    }
    el = 0;
}

if( el.readyState === 'complete' ) {
    init();
}
