(function(){
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const closeButton = document.getElementById('close-button');
    const dropdownButton = document.getElementById('dropdown-button');

    //Toggle the visibility side menu
    function changeMenuVisibility (){
        const menu = document.getElementById('lateral-menu');
        if(menu.classList.contains('hidden')){
            menu.classList.remove('hidden');
            menu.classList.add('flex');
        }else{
            menu.classList.remove('flex');
            menu.classList.add('hidden');

        }
    }

    //Toggle the visibility of the 'Categories' dropdown

    function changeDropdownVisibility (){
        const dropdown = document.getElementById('dropdown');
        if(dropdown.classList.contains('hidden')){
            dropdown.classList.remove('hidden');
            dropdown.classList.add('flex');
        }else{
            dropdown.classList.remove('flex');
            dropdown.classList.add('hidden');

        }
    }



    hamburgerMenu.addEventListener('click',changeMenuVisibility);
    closeButton.addEventListener('click',changeMenuVisibility);
    dropdownButton.addEventListener('click',changeDropdownVisibility);

})()