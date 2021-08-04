$(document).ready(function () {

  /* Ширина скролл-бара */
  var scrollSize = scrollbarWidth();

  /* Функция по определению ширины скролл-бара */
  function scrollbarWidth() {
    var block = $('<div>').css({ 'height': '50px', 'width': '50px' }),
      indicator = $('<div>').css({ 'height': '200px' });

    $('body').append(block.append(indicator));
    var w1 = $('div', block).innerWidth();
    block.css('overflow-y', 'scroll');
    var w2 = $('div', block).innerWidth();
    $(block).remove();
    return (w1 - w2);
  }

  /* При нажатии на кнопку меню показывать сайдбар */
  $('.menu-btn').on('click', function(e) {
    e.preventDefault;
    $(this).toggleClass('menu-btn_active');
    $('.sidebar').toggleClass('sidebar_active');
    $('.overlay').toggleClass('overlay_active');
    document.body.style.overflow = 'hidden';
    $('body').css("padding-right", scrollSize + "px");
  });

  /* При нажатии на кнопку закрыть, скрывать сайдбар */
  $('.sidebar__close').on('click', function (e) {
    e.preventDefault;
    $('.menu-btn').toggleClass('menu-btn_active');
    $('.sidebar').toggleClass('sidebar_active');
    $('.overlay').toggleClass('overlay_active');
    document.body.style.overflow = '';
    $('body').css("padding-right", "0px");
  });

  /* При нажатии на оверлей, скрывать сайдбар */
  $('.overlay').on('click', function (e) {
    e.preventDefault;
    $('.menu-btn').toggleClass('menu-btn_active');
    $('.sidebar').toggleClass('sidebar_active');
    $(this).toggleClass('overlay_active');
    document.body.style.overflow = '';
    $('body').css("padding-right", "0px");
  });

  /* Параметры слайдера */
  $('.slider-main__list').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    appendDots: $('.slider-main__dots'),
    dotsClass: 'slider-main__slick-dots'
  });

  /* Плавная прокрутка, при нажатии на Цифры */
  $(".page-nav__list a").click(function () {
    var _href = $(this).attr("href");
    $("html, body").animate({ scrollTop: $(_href).offset().top + "px" });
    return false;
  });

  /*
  $(".page-nav a").on("click", function (e) {
    var anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: $(anchor.attr('href')).offset().top
    }, 777);
    e.preventDefault();
    return false;
  });
  */

  /* Подцвечивать цифры, при прокрутки страницы */
  $(window).scroll(function () {
    var $sections = $('.section');
    $sections.each(function (i, el) {
      var top = $(el).offset().top - 100;
      var bottom = top + $(el).height();
      var scroll = $(window).scrollTop();
      var id = $(el).attr('id');
      if (scroll > top && scroll < bottom) {
        $('.page-nav a.active').removeClass('active');
        $('.page-nav a[href="#' + id + '"]').addClass('active');
      }
    });
  });

  /* Каталог */
  $('.card-one__img-box').imagefill();

/* КАРТА */
  var width = 960,
    height = 500;

  // Setting color domains(intervals of values) for our map

  var color_domain = [1, 2, 3, 4, 5]
  var color = d3.scale.threshold()
    .domain(color_domain)
    .range(["#e1eaec", "#d4d7e3", "green", "orange", "purple", "yellow"]);

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var svg = d3.select("#svg_map").append("svg")
    .attr("viewBox", "0 0 960 500")
    .style("margin", "10px auto");

  var projection = d3.geo.albers()
    .rotate([-105, 0])
    .center([-10, 65])
    .parallels([52, 64])
    .scale(700)
    .translate([width / 2, height / 2]);

  var path = d3.geo.path().projection(projection);

  //Reading map file and data

  queue()
    .defer(d3.json, "https://raw.githubusercontent.com/KoGor/Maps.GeoInfo/master/russia_1e-7sr.json")
    .defer(d3.csv, "../map/accidents.csv")
    .await(readyMap);

  //Start of Choropleth drawing

  function readyMap(error, map, data) {
    var hrefById = {};
    var colorRegionById = {};
    var nameById = {};

    data.forEach(function (d) {
      hrefById[d.RegionCode] = d.hrefLink;
      colorRegionById[d.RegionCode] = d.colorRegion;
      nameById[d.RegionCode] = d.RegionName;
    });

    //Drawing Choropleth

    svg.append("g")
      .attr("class", "region")
      .selectAll("path")
      .data(topojson.object(map, map.objects.russia).geometries)
      .enter().append("path")
      .attr("d", path)
      .style("fill", function (d) {
        return color(colorRegionById[d.properties.region]);
      })
      .style("opacity", 0.8)

      //Adding mouseevents
      .on("mousemove", function (d) {
        d3.select(this).transition().duration(200).style("opacity", 1);
        div.transition().duration(200)
          .style("opacity", 1)
        div.text(nameById[d.properties.region])
          .style("left", (d3.event.pageX - 100) + "px")
          .style("top", (d3.event.pageY - 50) + "px");
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition().duration(200)
          .style("opacity", 0.8);
        div.transition().duration(200)
          .style("opacity", 0);
      })
      .on("click", function (d) {
        console.log(hrefById[d.properties.region]); //filialById
        var href = hrefById[d.properties.region];
        if (href !== undefined) {
          window.location.href = href;
        }
      })

    // Adding cities on the map

  }; // <-- End of Choropleth drawing

});
