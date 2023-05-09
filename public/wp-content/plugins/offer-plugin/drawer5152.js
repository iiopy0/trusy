(function ($) {
  $(".drawer-toggle").on("click", function (e) {
    console.log("clicked");
    e.preventDefault();
    var $offerRow = $(this).closest(".offer-row");
    var $drawer = $offerRow.find(".drawer");
    $drawer.toggleClass("drawer-open");
    $offerRow.toggleClass("margin-bottom");
    var $drawerButton = $offerRow.find(".drawer-toggle");
    if ($drawer.hasClass("drawer-open")) {
      $drawerButton.text("SHOW LESS");
    } else {
      $drawerButton.text("SHOW MORE");
    }
  });
  var path = window.location.href;
  $('.wp-block-navigation__container a').each(function() {
    if (this.href === path) {
      $(this).parent().addClass('current-menu-item');
    }
  });

  if(window.location.href.includes("offers") && (!window.location.href.includes("stake") || window.location.href.includes("mystake"))){
    console.log("click");
    $(".drawer-toggle").click();
  }else if(window.location.pathname == '/'){
    const countries = new Map()
      $("#offer-country option").each(function(){
        if($(this).val != ""){
          countries.set($(this).text().toLowerCase(), $(this).val().toLowerCase());
        }
      });
      countries.set('other', 'other');

      fetch('https://extreme-ip-lookup.com/json/?key=jlnsdtxacXb6Ysy4jPyb')
      .then( res => res.json())
      .then(response => {
        
        var visitorCountry = response.country.toLowerCase();
        console.log(visitorCountry);
        var countryFound = false;
        if(countries.has(visitorCountry)){
          countryFound = true;
          $("#offer-country option").each(function(){
            if($(this).text().toLowerCase() === visitorCountry){
              console.log("Country: ", visitorCountry, $(this).text());
              $("#offer-country").val($(this).val()).change().trigger("chosen:updated");
            }
          });
        }else{
          $('#offer-country').prepend($('<option>', {
            value: response.countryCode,
            text: response.country
          }));
          $("#offer-country").val(response.countryCode).change().trigger("chosen:updated");
        }
      })
      .catch((data, status) => {
        console.log('Request failed');
        $("#offer-country").val("").change().trigger("chosen:updated");
      })
  }
  
  $("#offer-filter.chosen-select").chosen();
  $("#offer-country.chosen-select").chosenImage();

  $('#offer-filter').on('change', function() {
      var filter = $(this).val();
      $('.offer-row:not(.top)').each( function() {
        if(filter != "" && !$(this).hasClass(filter)){
          $(this).addClass("filtered-by-filter");
          $(this).hide();
        }else{
          $(this).removeClass("filtered-by-filter")
          if(!$(this).hasClass("filtered-by-country")){
            $(this).show();
          }
        }
      });
  });

  $('#offer-country').on('change', function() {
      var filter = $(this).val();
      if(filter != undefined && filter != ""){
        $(".country-flag-logo img").attr("src", "https://flagcdn.com/h80/"+filter.toLowerCase()+".png");
      }else{
        $(".country-flag-logo img").attr("src", "");
      }
      $('.offer-row').each( function() {
        var offerCountries = $(this).attr("data-countries");
        if(offerCountries != undefined && offerCountries != ""){
          offerCountries = offerCountries.split(',');
          if(!offerCountries.includes(filter)){
            $(this).hide();
            $(this).addClass("filtered-by-country");
          }else{
            $(this).removeClass("filtered-by-country");
            if(!$(this).hasClass("filtered-by-filter") && !offerCountries.includes("HR")){
              $(this).show();
            }else{
              if(offerCountries.includes("HR") && filter == "HR"){
                $(this).show();
              }else{
                $(this).hide();
              }
            }
          }
        }
      });
  });
})(jQuery);
