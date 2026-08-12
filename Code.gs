/**
 * Ntuma Admin Dashboard - Google Sheets API Backend
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet.
 * 2. Create two tabs: "Categories" and "Products".
 * 3. In "Categories" tab, add headers to row 1: id | name | description | createdAt
 * 4. In "Products" tab, add headers to row 1: id | name | categoryId | price | unit | description | createdAt
 * 5. Go to Extensions > Apps Script.
 * 6. Replace the default code with this entire script.
 * 7. Click "Deploy" > "New deployment".
 * 8. Select type "Web app".
 * 9. Execute as: "Me" (your email).
 * 10. Who has access: "Anyone".
 * 11. Click Deploy, authorize permissions, and copy the resulting "Web app URL".
 * 12. Use this URL in your Next.js app as NEXT_PUBLIC_SHEETS_API_URL.
 */

function doGet(e) {
  var action = e.parameter.action;
  
  try {
    if (action === 'listCategories') {
      return jsonResponse(true, getRecords('Categories'));
    } else if (action === 'listProducts') {
      return jsonResponse(true, getRecords('Products'));
    } else {
      return jsonResponse(false, { error: 'Unknown GET action' }, 400);
    }
  } catch (error) {
    return jsonResponse(false, { error: error.toString() }, 500);
  }
}

function doPost(e) {
  try {
    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }
    
    var action = data.action;
    
    if (action === 'addCategory') {
      var newRecord = {
        id: Utilities.getUuid(),
        name: data.name || '',
        description: data.description || '',
        createdAt: new Date().toISOString()
      };
      appendRecord('Categories', ['id', 'name', 'description', 'createdAt'], newRecord);
      return jsonResponse(true, newRecord);
      
    } else if (action === 'addProduct') {
      var newRecord = {
        id: Utilities.getUuid(),
        name: data.name || '',
        categoryId: data.categoryId || '',
        price: data.price || 0,
        unit: data.unit || '',
        description: data.description || '',
        createdAt: new Date().toISOString()
      };
      appendRecord('Products', ['id', 'name', 'categoryId', 'price', 'unit', 'description', 'createdAt'], newRecord);
      return jsonResponse(true, newRecord);
      
    } else if (action === 'deleteCategory') {
      var success = deleteRecord('Categories', data.id);
      return jsonResponse(success, success ? { message: 'Category deleted' } : { error: 'Category not found' });
      
    } else if (action === 'deleteProduct') {
      var success = deleteRecord('Products', data.id);
      return jsonResponse(success, success ? { message: 'Product deleted' } : { error: 'Product not found' });
      
    } else if (action === 'updateProduct') {
      var success = updateRecord('Products', data.id, data);
      return jsonResponse(success, success ? { message: 'Product updated' } : { error: 'Product not found' });
      
    } else {
      return jsonResponse(false, { error: 'Unknown POST action' }, 400);
    }
  } catch (error) {
    return jsonResponse(false, { error: error.toString() }, 500);
  }
}

function getRecords(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return [];
  
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return []; // Only headers or empty
  
  var headers = data[0];
  var records = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var record = {};
    for (var j = 0; j < headers.length; j++) {
      record[headers[j]] = row[j];
    }
    records.push(record);
  }
  
  return records;
}

function appendRecord(sheetName, columns, record) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet ' + sheetName + ' not found');
  
  var rowData = [];
  for (var i = 0; i < columns.length; i++) {
    rowData.push(record[columns[i]] !== undefined ? record[columns[i]] : '');
  }
  
  sheet.appendRow(rowData);
}

function deleteRecord(sheetName, id) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return false;
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idIndex = headers.indexOf('id');
  
  if (idIndex === -1) return false;
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][idIndex] === id) {
      sheet.deleteRow(i + 1); // +1 because sheet rows are 1-indexed
      return true;
    }
  }
  return false;
}

function updateRecord(sheetName, id, updates) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return false;
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idIndex = headers.indexOf('id');
  
  if (idIndex === -1) return false;
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][idIndex] === id) {
      var rowNumber = i + 1;
      for (var key in updates) {
        if (key === 'id' || key === 'action') continue; // Don't update ID or action
        var colIndex = headers.indexOf(key);
        if (colIndex !== -1) {
          // sheet cells are 1-indexed, so colIndex + 1
          sheet.getRange(rowNumber, colIndex + 1).setValue(updates[key]);
        }
      }
      return true;
    }
  }
  return false;
}

function jsonResponse(success, data, statusCode) {
  var response = {
    success: success,
    data: data
  };
  
  var output = ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
    
  return output;
}
