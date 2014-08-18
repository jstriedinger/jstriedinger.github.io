var resumes_es = ['./files/resume_spanish1.pdf','./files/resume_spanish2.pdf'];
var resumes_en = ['./files/resume_english1.pdf','./files/resume_english2.pdf'];

function get_random_resume(l)
{
  if(l=="en")
    var rand = resumes_en[Math.floor(Math.random() * resumes_en.length)];
  else
    var rand = resumes_es[Math.floor(Math.random() * resumes_es.length)];
  
  return rand;
}
window.onload = function(){

  $("#resume_spanish").prop("href", get_random_resume("es"));
  $("#resume_english").prop("href", get_random_resume("en"));

  $('#fader').transition({ y: '-40px', opacity:0.6 },800);0
  $('#fader').transition({ opacity:1 },500);
  $('#fader hr').transition({ width:'800px',delay:500 },1500);


  $.fx.speeds._default = 1500;
  var navigation = responsiveNav(".nav-collapse");
  $('a#contact_link').click(function() {
    $.smoothScroll({
      scrollTarget: '#contact', speed: 1000
    });
    return false;
  }); 
  $('a#about_link').click(function() {
    $.smoothScroll({
      scrollTarget: '#me', speed: 1000,offset: -100
    });
    return false;
  }); 
  $('a#life_link').click(function() {
    $.smoothScroll({
      scrollTarget: '#life', speed: 1000,offset: -100
    });
    return false;
  }); 
  $('a#home_link').click(function() {
    $.smoothScroll({
      scrollTarget: '#home', speed: 1000,
    });
    return false;
  });    

  $('#skills').waypoint(function(up){
      $('#skills').waypoint('destroy');
      $('.skill.dev').transition({ opacity: 1});
      $('.skill.entrepreneur').transition({ opacity: 1 });
      $('.skill.design').transition({ opacity: 1 });
      $('#skill_design_txt, #skill_dev_txt, #skill_entrepreneur_txt').transition({ opacity: 1 });
  }, { offset: 350 });

  $('#life').waypoint(function(up){
      $('#life').waypoint('destroy');
      $('#life hr').transition({ width:'800px' });
      $('.col1_3.life_item').transition({opacity: 1});
  }, { offset: 200 });

  $('#me').waypoint(function(up){
      $('#me').waypoint('destroy');
      $('#me hr').transition({ width:'800px' },1500);
  }, { offset: 200 });

  $('#contact').waypoint(function(up){
      $('#contact').waypoint('destroy');
      $('#contact hr').transition({ width:'800px' },1500);
  }, { offset: 450 });

};