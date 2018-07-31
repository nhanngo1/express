$(function() {
    $.getJSON('dataJson', updateUserTable);
    let currentRows = $('#userdata tr').length;
    let userStatus = ''

    $("#search-btn").on('click', function(e) {
        clearStatus();
        console.log('rows: ' + $('#userdata tr').length);
        console.log('click search buton');

        let user = $('#search-text').val()
        currentRows = $('#userdata tr').length;
        if (user !== '') {
            $.get('users/' + user, '', function(data) {
                updateUserTable(data);
                updateStatus();
            })
        } else {
            $('#validation-msg').text('Please enter account name');
        }
    })

    function updateUserTable(data) {
        let response = '';
        console.log("data: " + data.length)
        $.each(data, (index, user) => {
            if (user.login != 'undefined') {
                response += '           <tr>';
                response += '               <td>' + user.login + '</td>';
                response += '               <td><div class="editable">' + user.name + '</div></td>';
                response += '               <td><div class="editable">' + user.company + '</div></td>';
                response += '               <td class="action"><button class="fa fa-edit btn btn_edit" id="edt_' + index + '">';
                response += '               <button type="button" class="fa fa-trash btn btn_delete" id="del_' + index + '">';
                response += '               <button type="button" class="fa fa-save btn btn_save" id="sav_' + index + '">';
                response += '               <button type="button" class="fa fa-ban btn btn_cancel" id="can_' + index + '"></td>';
                response += '           </tr>';
            }
        });

        if (response != '')
            $('#user-info').html(response);
        else
            $('#user-info').html("");

        // hide save/cancel buttons
        $(document).find('.btn_save').hide();
        $(document).find('.btn_cancel').hide();
    }

    function updateStatus() {
        let tableRows = $('#userdata tr').length;
        if (currentRows < tableRows) // add new user
            $('#validation-msg').text($("#search-text").val() + ' has been added');
        else if (currentRows > tableRows) // delete user
            $('#validation-msg').text('User has been deleted');
        else if ($('#search-text').val() != '' && (currentRows == tableRows)) // user does not exist
            $('#validation-msg').text($("#search-text").val() + ' does not exist');
    }

    function clearStatus() {
        $('#validation-msg').text('');
    }

    $("#userdata").on('click', '.btn_delete', function(e) {
        currentRows = $('#userdata tr').length;
        let index = e.target.getAttribute('id').substr(4, e.target.getAttribute('id').length)
        console.log("click delete")
        clearStatus();
        deleteUser(index);
    })

    $("#userdata").on('click', '.btn_edit', function(e) {
        currentRows = $('#userdata tr').length;
        console.log("click edit")
        let index = e.target.getAttribute('id').substr(4, e.target.getAttribute('id').length)
        let tbl_row = $(this).closest('tr');

        // change buttons status
        tbl_row.find('.btn_edit').hide();
        tbl_row.find('.btn_delete').hide();
        tbl_row.find('.btn_save').show();
        tbl_row.find('.btn_cancel').show();

        // change editable fields css
        tbl_row.css('color', 'red')
        tbl_row.find('.editable')
            .attr('contenteditable', 'true')
            .addClass('editing')

        // save the current value to 'original_entry' attribute
        // will use this value in case user click cancel button
        tbl_row.find('.editable').each(function(index, val) {
            $(this).attr('original_entry', $(this).html());
        });
    })

    $("#userdata").on('click', '.btn_save', function(e) {
        console.log("click save")

        let tbl_row = $(this).closest('tr');
        let index = e.target.getAttribute('id').substr(4, e.target.getAttribute('id').length)

        // change button status
        tbl_row.find('.btn_edit').show();
        tbl_row.find('.btn_delete').show();
        tbl_row.find('.btn_save').hide();
        tbl_row.find('.btn_cancel').hide();

        // update css
        tbl_row.css('color', 'black')
        tbl_row.find('.editable')
            .removeAttr('contenteditable')
            .removeClass('editing')

        // get updated value
        let arrValue = [];
        tbl_row.find('.editable').each(function(index, val) {
            arrValue.push($(this).html());
        })

        // send POST request to save to file
        let data = { name: arrValue[0], company: arrValue[1] }
        editUser(index, data)
    })

    $("#userdata").on('click', '.btn_cancel', function(e) {

        let tbl_row = $(this).closest('tr');

        // update css
        tbl_row.css('color', 'black')
        tbl_row.find('.editable')
            .removeAttr('contenteditable')
            .removeClass('editing')

        // change button status
        tbl_row.find('.btn_edit').show();
        tbl_row.find('.btn_delete').show();
        tbl_row.find('.btn_save').hide();
        tbl_row.find('.btn_cancel').hide();

        // load original value
        tbl_row.find('.editable').each(function(index, val) {
            $(this).html($(this).attr('original_entry'));
        })
    })

    function deleteUser(userIndex) {
        console.log(`delete User #${userIndex}`)
        $.ajax({
            url: `/users/${userIndex}`,
            type: "DELETE",
            success: updateUserTable
        })
    }

    function editUser(userIndex, data) {
        console.log(`edit User #${userIndex}`)
        $.ajax({
            url: `/users/${userIndex}`,
            type: "POST",
            data: data,
            dataType: 'json',
            success: ''
        })
    }
})