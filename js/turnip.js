$(function() {

var machine = new TuringMachine();

var originalTape = '';
var originalPosition = 0;

var ui = {
  stateTable: $('#state-table'),
  template: $('#state-table tr.template')
}

function addTableRow() {
  var template = $('tr.template', ui.stateTable).clone().removeClass('template');
  var tbody = $('tbody', ui.stateTable);
  initTemplate(template);
  template.appendTo(tbody);
}

function readTableRow(tr) {
  var rule = {};
  rule.currentState = $(tr).attr('data-start-state') ? 0 : $(tr).attr('data-state-name');
  rule.currentSymbol = $(tr).attr('data-current-symbol') ? $(tr).attr('data-current-symbol') : ' ';
  rule.nextState = $('.next-state input', tr).val().substring(0, 1);
  rule.symbolToWrite = $('.symbol-to-write input', tr).val().substring(0, 1);
  rule.direction = $('.direction select', tr).val();

  if (!rule.nextState)
    rule.nextState = 0;
  if (!rule.symbolToWrite)
    rule.symbolToWrite = ' ';
  return rule;
}

function readStateTable() {
  $('tbody tr:not(.template)', ui.stateTable).each(function() {
    console.log(this);
    var rule = readTableRow(this);
    console.log(rule);
    machine.addRule(rule.currentState, rule.currentSymbol, rule.symbolToWrite, rule.direction, rule.nextState);
  });
}

function updateTapeUI(sta, sym) {
  var spans = '';
  var currentTape = machine.getTape();
  var currentPosition = machine.position;
  for (var i = 0; i < currentTape.length; ++i) {
    var span = '<span';
    if (i === currentPosition) {
      span += ' class="active"';
    }
    span += '>' + currentTape[i] + '</span>';
    spans += span;
  }

  $('#tape').html(spans);

  if (sym) {
    // console.log($('#stat-table tbody tr[data-state-name=' + sta + '][data-current-symbol=' + sym + ']'));
    $('#stat-table tbody tr[data-current-symbol=' + sym + '] input').css('font-weight', 'bold');
  }
  else {
    $('#stat-table tbody tr input').css('font-weight', 'normal');
  }
}

function initTemplate(context) {
  if (!context) {
    context = $('tbody tr', ui.stateTable);
  }

  $(context).each(function() {
    var tr = this;
    $('.direction [data-value=N]', tr).addClass('active');
    $('.state-name input', tr).change(function(e) {
      if (!this.value) {
        $(this.parentNode.parentNode)
          .removeAttr('data-state-name')
          .attr('data-start-state', 'true');
      }
      else {
        $(this.parentNode.parentNode)
          .removeAttr('data-start-state')
          .attr('data-state-name', this.value);
      }
    }).change();
    $('.current-symbol input', context).change(function(e) {
      $(this.parentNode.parentNode).attr('data-current-symbol', this.value);
    }).change();
    $('button.delete-button', context).click(function(e) {
      e.preventDefault();
      this.blur();
      $(this.parentNode.parentNode).detach();
    });
  });
}

var currentMode = 'edit';
function playMode() {
  currentMode = 'play';

  originalTape = $('#tape-editor').val();
  machine = new TuringMachine();
  machine.setTape(originalTape);
  updateTapeUI();
  readStateTable();
  machine.state = Object.keys(machine.rules)[0];
  machine.onstep = updateTapeUI;
  machine.onhalt = haltMode;

  $('#tape-editor').hide();
  $('#tape').show();
  $('#edit-button span').text('Edit tape');
  $('#play-button, #step-button').removeAttr('disabled').attr('class', 'btn btn-success');
  $('#reset-button').removeAttr('disabled').attr('class', 'btn btn-warning');
  $('#edit-button').attr('class', 'btn btn-info');
}
function haltMode() {
  $('#play-button, #step-button').attr('disabled', 'disabled').attr('class', 'btn btn-default');
  $('#edit-button').attr('class', 'btn btn-success');
  $('#reset-button').attr('class', 'btn btn-success');
}
function editMode() {
  currentMode = 'edit';
  $('#tape').hide();
  $('#tape-editor').show();
  $('#play-button, #step-button, #reset-button').attr('disabled', 'disabled').attr('class', 'btn btn-default');
  $('#edit-button').attr('class', 'btn btn-success');
  $('#edit-button span').text('Finish editing tape');
}


$('#add-rule-button').click(function(e) {
  e.preventDefault();
  addTableRow();
  this.blur();
});

$('#play-button').click(function(e) {
  e.preventDefault();
  readStateTable();
});

$('#step-button').click(function(e) {
  e.preventDefault();
  readStateTable();
  machine.step();
  updateTapeUI();
  this.blur();
});

$('#reset-button').click(function(e) {
  e.preventDefault();
  machine.tape = originalTape;
  machine.position = originalPosition;
  updateTapeUI();
  playMode();
})

$('#mode-nav a.edit-link').click(function(e) {
  e.preventDefault();
  this.blur();
  $(this).tab('show');
});
$('a.run-link').click(function(e) {
  e.preventDefault();
  initRun();
  this.blur();
  $('#mode-nav a.run-link').tab('show');
});
$('#edit-button').click(function(e) {
  e.preventDefault();
  this.blur();
  if (currentMode === 'edit') {
    playMode();
  }
  else {
    editMode();
  }
})

editMode();
initTemplate();

});