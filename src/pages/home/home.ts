import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as Survey from 'survey-angular';
declare var $:any;
// declare var Inputmask:any;
 import "inputmask/dist/inputmask/inputmask.numeric.extensions.js";
 import Inputmask from "inputmask/dist/inputmask/inputmask.date.extensions.js";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  questions;
  datepickerWidget;
  inputMaskedWidget: {};
  constructor(public navCtrl: NavController) {
    var responseStub =   {  
      questions:[
      {
          isRequired: false,
          name: "332_433",
          title: "Please enter your name",
          type: "text"
      },{
          name: "date",
          type: "text",
          inputType: "date",
          title: "Your favorite date:",
          dateFormat: "dd/mm/yyyy",
          isRequired: true
      },{
          type: "text",
          name: "191_240",
          title: "Test",
          isRequired: false,
          renderAs: "inputMask"          
      }
        ],
        answeredOptions:{  
            
        },
        questionnaireId:5,
        name:'DM',
        description:'DM',
        isBaseLine:true,
        eventName:'Baseline',
        validations:{  
            mandatoryQuestionNames:[  
              
            ],
            inputMaskedField:{  
              
            },
            
        }
      }
    this.questions = { 'questions': responseStub.questions};
  }

  ionViewDidLoad() {
    
    
    var survey = new Survey.Model(this.questions);
    // survey.onComplete.add(sendDataToServer);
    this.createDatePicker();
    Survey.CustomWidgetCollection.Instance.addCustomWidget(this.datepickerWidget);
    Survey.JsonObject.metaData.addProperty('text', { name: 'renderAs', default: 'standard', choices: ['standard', 'inputmask'] });
    this.createInputMaskedFields();
    Survey.CustomWidgetCollection.Instance.addCustomWidget(this.inputMaskedWidget);
    Survey.JsonObject.metaData.addProperty('text', { name: 'renderAs', default: 'standard', choices: ['standard', 'inputmask'] });
    Survey.SurveyNG.render("surveyElement", {model:survey});
  }
  createDatePicker() {
    console.log('here');
    this.datepickerWidget = {
      name: "datepicker",
      title: "Date picker",
      iconName: "icon-datepicker",
      widgetIsLoaded: function() {
        return !!$.fn.datepicker;
      },
      isFit: function(question) {
         console.log('question', question);
        
        return question.name === "date";
      },
      htmlTemplate:
        "<input class='form-control widget-datepicker' type='text'>",
      activatedByChanged: function(activatedBy) {
        Survey.JsonObject.metaData.addClass(
          "datepicker",
          [
            { name: "inputType", visible: false },
            { name: "inputFormat", visible: false },
            { name: "inputMask", visible: false }
          ],
          null,
          "text"
        );
        Survey.JsonObject.metaData.addProperty("datepicker", {
          name: "dateFormat",
          default: "dd/mm/yy",
          choices: [
            "dd/mm/yy",
            "yy-mm-dd",
            "d M, y",
            "d MM, y",
            "DD, d MM, yy",
            "'day' d 'of' MM 'in the year' yy"
          ]
        });
      },
      afterRender: function(question, el) {
        var $el = $(el).is(".widget-datepicker") ? $(el) : $(el).find(".widget-datepicker");
        var pickerWidget = $el.datepicker({
          dateFormat: question.dateFormat,
          option: {
            minDate: null,
            maxDate: null
          },
          onSelect: function(dateText) {
            question.value = dateText;
          }
        });
        question.valueChangedCallback = function() {
          if (question.value) {
            pickerWidget.datepicker("setDate", new Date(question.value));
          } else {
            pickerWidget.datepicker("setDate", null);
          }
        };
        question.valueChangedCallback();
      },
      willUnmount: function(question, el) {
        var $el = $(el).is(".widget-datepicker")
          ? $(el)
          : $(el).find(".widget-datepicker");
        $el.datepicker("destroy");
      }
    };
  }
  createInputMaskedFields() {
    const self = this;
    this.inputMaskedWidget = {
      name: 'inputmask',
      isDefaultRender: true,
      isFit: function (question) {
        console.log('question.name', question.name);
        
        return (question.name === '191_240');
        
        // return question['renderAs'] === 'inputmask';
      },
      afterRender: function (question, el) {
        console.log('find', $(el).find('input'))
        const $el = $(el).find('input');
        const inputfield = {'inputType': "time"}
        console.log('inputfield.inputType',inputfield.inputType);
        
        switch (inputfield.inputType) {
          case 'time':
          console.log('$el',$el);
          
            Inputmask("hh:mm").mask($el);
            // $el.inputmask('datetime', { inputFormat: 'HH:MM', alias: 'HH:MM' });
            break;
          default:
            break;
        }

        const updateHandler = function () {
          // $el.inputmask({ setvalue: question.value });
          $('#' + question.name).val(question.value);
        };
        question.valueChangedCallback = updateHandler;
        updateHandler();
      },
      willUnmount: function (question, el) {
        $(el).find('input').inputmask('remove');
      }
    };
  }
}
