SetCalculatorComponent = {
    ext_lang: 'set_calculator_code',
    formats: ['format_set_calculator_json'],
    struct_support: true,

    factory: function(sandbox) {
        return new setCalculatorViewerWindow(sandbox);
    }
};

var setCalculatorViewerWindow = function(sandbox) {

    var self = this;
    this.sandbox = sandbox;
    this.sandbox.container = sandbox.container;

    var AInputSetCalculator = '#set-calculator-tools-' + sandbox.container + " #set-calculator-input-a"
    var BInputSetCalculator = '#set-calculator-tools-' + sandbox.container + " #set-calculator-input-b"
    var title = '#set-calculator-tools-' + sandbox.container + " #title";
    var buttonIntersection =  '#set-calculator-tools-' + sandbox.container + " #button-intersection";
    var buttonCombination =  '#set-calculator-tools-' + sandbox.container + " #button-combination";
    var buttonABDifference =  '#set-calculator-tools-' + sandbox.container + " #button-a-b-difference";
    var buttonBADifference =  '#set-calculator-tools-' + sandbox.container + " #button-b-a-difference";
    var buttonSymmDiff =  '#set-calculator-tools-' + sandbox.container + " #button-symmetric-diff";
    var buttonAPower =  '#set-calculator-tools-' + sandbox.container + " #button-a-power";
    var buttonBPower =  '#set-calculator-tools-' + sandbox.container + " #button-b-power";
    var buttonDesMult =  '#set-calculator-tools-' + sandbox.container + " #button-descartes-multiplication";

    var keynodes = ['ui_set_calculator_load_in_memory'];

    $('#' + sandbox.container).prepend('<div class="inputBox" id="set-calculator-tools-' + sandbox.container + '"></div>');
    $('#set-calculator-tools-' + sandbox.container).load('static/components/html/set-calculator-main-page.html', function() {
        SCWeb.core.Server.resolveScAddr(keynodes, function (keynodes) {
            SCWeb.core.Server.resolveIdentifiers(keynodes, function (idf) {
                var buttonLoad = idf[keynodes['ui_set_calculator_load_in_memory']];

                $(title).html(buttonLoad);
                $(buttonIntersection).html('A∩B');
                $(buttonCombination).html('A∪B');
                $(buttonABDifference).html('A\\B');
                $(buttonBADifference).html('B\\A');
                $(buttonSymmDiff).html('AΔB');
                $(buttonAPower).html('|A|');
                $(buttonBPower).html('|B|');
                $(buttonDesMult).html('A✕B');


                $(buttonIntersection).click(function() {
                    var AString = $(AInputSetCalculator).val();
                    var BString = $(BInputSetCalculator).val();
                    if (isValidUserString(AString) && isValidUserString(BString)) {
                        callCalculator(AString,BString,'∩');
                    }else{
                        console.log("Wrong input");
                    }
                });

                $(buttonCombination).click(function() {
                    var AString = $(AInputSetCalculator).val();
                    var BString = $(BInputSetCalculator).val();
                    if (isValidUserString(AString) && isValidUserString(BString)) {
                        callCalculator(AString,BString,'∪');
                    }else{
                        console.log("Wrong input");
                    }
                });

                $(buttonABDifference).click(function() {
                    var AString = $(AInputSetCalculator).val();
                    var BString = $(BInputSetCalculator).val();
                    if (isValidUserString(AString) && isValidUserString(BString)) {
                        callCalculator(AString,BString,'A\\B');
                    }else{
                        console.log("Wrong input");
                    }
                });

                $(buttonBADifference).click(function() {
                    var AString = $(AInputSetCalculator).val();
                    var BString = $(BInputSetCalculator).val();
                    if (isValidUserString(AString) && isValidUserString(BString)) {
                        callCalculator(AString,BString,'B\\A');
                    }else{
                        console.log("Wrong input");
                    }
                });

                $(buttonSymmDiff).click(function() {
                    var AString = $(AInputSetCalculator).val();
                    var BString = $(BInputSetCalculator).val();
                    if (isValidUserString(AString) && isValidUserString(BString)) {
                        callCalculator(AString,BString,'Δ');
                    }else{
                        console.log("Wrong input");
                    }
                });

                $(buttonAPower).click(function() {
                    var AString = $(AInputSetCalculator).val();
                    var BString = $(BInputSetCalculator).val();
                    if (isValidUserString(AString)) {
                        callCalculator(AString,BString,'|A|');
                    }else{
                        console.log("Wrong input");
                    }
                });

                $(buttonBPower).click(function() {
                    var AString = $(AInputSetCalculator).val();
                    var BString = $(BInputSetCalculator).val();
                    if (isValidUserString(BString)) {
                        callCalculator(AString,BString,'|B|');
                    }else{
                        console.log("Wrong input");
                    }
                });

                $(buttonDesMult).click(function() {
                    var AString = $(AInputSetCalculator).val();
                    var BString = $(BInputSetCalculator).val();
                    if (isValidUserString(AString) && isValidUserString(BString)) {
                        callCalculator(AString,BString,'✕');
                    }else{
                        console.log("Wrong input");
                    }
                });
            });
        });
    });

    this.applyTranslation = function(namesMap) {
        SCWeb.core.Server.resolveScAddr(keynodes, function (keynodes) {
            SCWeb.core.Server.resolveIdentifiers(keynodes, function (idf) {
                var buttonLoad = idf[keynodes['ui_set_calculator_load_in_memory']];

                $(buttonSave).html(buttonLoad);
            });
        });
    };
    this.sandbox.eventApplyTranslation = $.proxy(this.applyTranslation, this);

};

SCWeb.core.ComponentManager.appendComponentInitialize(SetCalculatorComponent);

function isValidUserString(userString){
    var re = /^\w[a-z0-9,]+\w$/;
    if (re.test(userString) ) {
        return true;
    }else{
        return false;
    }
}


function callCalculator(inputA,inputB,operation){
    var AElements = getSetElements(inputA);
    var BElements = getSetElements(inputB);
    var generated = {
        names: [],
        nodes: []
    };
    var i;
    SCWeb.core.Server.resolveScAddr(['nrel_system_identifier','set','ui_menu_file_for_finding_intersection','ui_menu_file_for_finding_union',
    'ui_menu_file_for_finding_sets_difference','ui_menu_file_for_finding_descartes_multiplication',
    'ui_menu_file_for_finding_symmetric_sets_difference','ui_menu_file_for_finding_power'], function (keynodes) {        
        var nrelSysId = keynodes['nrel_system_identifier'];
        var conceptSet = keynodes['set'];
        window.sctpClient.create_node(sc_type_const).done(function (ANode) {
            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, conceptSet, ANode);
            window.sctpClient.create_link().done(function (linkAId) { 
                window.sctpClient.set_link_content(linkAId, "A");    
                window.sctpClient.create_arc(sc_type_const, ANode, linkAId).done(function (commonAArc) { 
                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrelSysId, commonAArc); 
                    AElements.forEach(function (element){
                        i = generated.names.indexOf(element);
                        if(i === -1){
                            window.sctpClient.create_node(sc_type_const).done(function (el) {
                                generated.names.push(element);
                                generated.nodes.push(el);
                                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, ANode, el);
                                window.sctpClient.create_link().done(function (linkEl) {
                                    window.sctpClient.set_link_content(linkEl, element);
                                    window.sctpClient.create_arc(sc_type_const, el, linkEl).done(function (commonArc) {
                                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrelSysId, commonArc);
                                    });
                                });
                            });
                        }else{
                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, ANode, generated.nodes[i]);
                        }
                    });
                   window.sctpClient.create_node(sc_type_const).done(function (BNode) {
                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, conceptSet, BNode);
                        window.sctpClient.create_link().done(function (linkBId) { 
                            window.sctpClient.set_link_content(linkBId, "B");    
                            window.sctpClient.create_arc(sc_type_const, BNode, linkBId).done(function (commonBArc) { 
                                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrelSysId, commonBArc); 
                                BElements.forEach(function (element){
                                    i = generated.names.indexOf(element);
                                    if(i === -1){
                                        window.sctpClient.create_node(sc_type_const).done(function (el) {
                                            generated.names.push(element);
                                            generated.nodes.push(el);
                                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, BNode, el);
                                            window.sctpClient.create_link().done(function (linkEl) {
                                                window.sctpClient.set_link_content(linkEl, element);
                                                window.sctpClient.create_arc(sc_type_const, el, linkEl).done(function (commonArc) {
                                                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrelSysId, commonArc);
                                                });
                                            });
                                        });
                                    }else{
                                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, BNode, generated.nodes[i]);
                                    }
                                });
                                perfomOperation(operation,keynodes,[ANode,BNode]);
                            });
                        });
                    });
                });
            });
        });
    });
}

function getSetElements(input){
    var comma = input.indexOf(',');
    var elements = [];
    var current;
    while(comma > -1){
        current = input.substring(0,comma);
        elements.push(current);
        input = input.substring(comma + 1);
        comma = input.indexOf(',');
    }
if(input!='')
    elements.push(input);
    console.log(elements);
    return elements;
}

function perfomOperation(operation,keynodes,arguments){
    switch(operation){
    case '∩':{
            SCWeb.core.Main.doCommand(keynodes['ui_menu_file_for_finding_intersection'], arguments);
    }break;
    case '∪':{
            SCWeb.core.Main.doCommand(keynodes['ui_menu_file_for_finding_union'], arguments);
    }break;
    case 'A\\B':{
            SCWeb.core.Main.doCommand(keynodes['ui_menu_file_for_finding_sets_difference'], [arguments[1],arguments[0]]);
    }break;
    case 'B\\A':{
            SCWeb.core.Main.doCommand(keynodes['ui_menu_file_for_finding_sets_difference'], [arguments[0],arguments[1]]);
    }break;
    case 'Δ':{
            SCWeb.core.Main.doCommand(keynodes['ui_menu_file_for_finding_symmetric_sets_difference'], arguments);
    }break;
    case '✕':{
            SCWeb.core.Main.doCommand(keynodes['ui_menu_file_for_finding_descartes_multiplication'], arguments);
    }break;
    case '|A|':{
            SCWeb.core.Main.doCommand(keynodes['ui_menu_file_for_finding_power'], [arguments[0]]);
    }break;
    case '|B|':{
            SCWeb.core.Main.doCommand(keynodes['ui_menu_file_for_finding_power'], [arguments[1]]);
    }break;
    }
}  
