$(() => {
  const navbar = $('#navbarSupportedContent');
  const pagination = $('#nav-bottom .pagination');
  const menu = $('<ul>')
    .addClass('navbar-nav')
    .appendTo(navbar);
  $('h2')
    .each(function (index) {
      const h2 = $(this);
      const h2_id = `h2_${index + 1}`;
      const dropdown_id = `dropdown_${index + 1}`;

      const li = $('<li>')
        .addClass('nav-item dropdown')
        .appendTo(menu);
      // class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false";
      const a = $('<a>')
        .addClass('nav-link dropdown-toggle')
        .attr('id', dropdown_id)
        .attr('role', 'button')
        .attr('href', '#' + h2_id)
        .attr('data-toggle', 'dropdown')
        .attr('aria-haspopup', 'true')
        .attr('aria-expanded', 'false')
        .attr('data-display', 'static')
        .text(h2.text())
        .appendTo(li);
      const dropdown_div = $('<div>')
        .addClass('dropdown-menu')
        .attr('aria-labelledby', dropdown_id)
        .appendTo(li);
      h2.closest('article').find('h3')
        .each(function (index) {
          const h3 = $(this);
          const h3_id = `${h2_id}_h3_${index + 1}`;
          const a = $('<a>')
            .addClass('dropdown-item')
            .text(`${index + 1}. ${h3.text()}`)
            .attr('href', `#${h3_id}`)
            .appendTo(dropdown_div);
          h3
            .attr('id', h3_id);
        });
    });

  $('main article')
    .addClass('d-none d-print-block');
  const sections = $('main section')
    .addClass('d-none d-print-block')
    .each(function (index) {
      const section = $(this);
      section
        .attr('data-index', index);
    });
  function displaySection(h3_id) {
    const h3 = $(`#${h3_id}`);
    const section = h3.closest('section');
    const article = section.closest('article');
    const index = section.data('index');
    $('main article')
      .addClass('d-none');
    $('section')
      .addClass('d-none');
    section
      .removeClass('d-none');
    article
      .removeClass('d-none');
    displayPagination(index, sections.length, 5);
  }

  function displayPaginationItem(index, text, isactive) {
    const h3_id = sections.eq(index).find('h3').attr('id');
    // <li class="page-item"><a class="page-link" href="#">Previous</a></li>
    const li = $('<li>')
      .addClass('page-item')
      .appendTo(pagination);
    const a = $('<a>')
      .addClass('page-link')
      .attr('href', `#${h3_id}`)
      .text(text)
      .appendTo(li);
    if (isactive) {
      li.addClass('active');
    }
  }

  function displayPagination(current, length, items) {
    pagination
      .html('');
    numPage
      .attr('max', length)
      .attr('step', 1)
      .val(current + 1);
    countPages
      .text(length);
    let start = current - Math.floor(items / 2);
    if (start < 0) {
      start = 0;
    }
    let end = start + items;
    if (end > length - 1) {
      end = length;
      start = end - items;
      if (start < 0) {
        start = 0;
      }
    }
    // if (start > 0) {
    //   displayPaginationItem(0, '<<', 0 === current);
    // }
    for (let i = start; i < end; i++) {
      displayPaginationItem(i, i + 1, i === current);
    }
    // if (end < length - 1) {
    //   displayPaginationItem(length - 1, '>>', length - 1 === current);
    // }
    pagination.find('a')
      .click(handleSectionClick);
    localStorage.setItem(location.pathname, current);
  }

  function handleSectionClick(e) {
    e.preventDefault();
    anchors
      .removeClass('active');
    const link = $(e.target);
    const href = link.attr('href').substr(1);
    if (href.indexOf('h3') > 0) {
      link.addClass('active');
      displaySection(href);
    }
  }

  function displaySectionByPage(pos) {
    if (pos < 0) {
      pos = 0
    } else if (pos >= sections.length) {
      pos = sections.length - 1;
    }
    const h3_id = sections.eq(pos).find('h3').attr('id');
    displaySection(h3_id);
  };

  const numPage = $('#num-page')
    .on('input', e => {
      let pos = +numPage.val() - 1;
      displaySectionByPage(pos);
    })
    .on('keydown', e => {
      if (e.keyCode == 13) {
        let pos = +numPage.val() - 1;
        console.log(pos);
        displaySectionByPage(pos);
      }
    });
  const countPages = $('#count-pages');
  const anchors = navbar.find('a.dropdown-item');
  const current_index = +localStorage.getItem(location.pathname) || 0;
  anchors
    .click(handleSectionClick);
  anchors.eq(current_index)
    .click();
});