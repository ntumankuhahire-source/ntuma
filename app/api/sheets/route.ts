import { NextRequest, NextResponse } from 'next/server';
import { getGoogleSheetsClient, rowsToObjects } from '@/lib/googleSheetsService';

// ── ensureHeaders cache ──────────────────────────────────────────────────────
// This runs multiple Google API calls to scaffold sheets/headers.
// Cache the result so we only pay the cost ONCE per server process lifecycle
// (not on every single GET/POST request).
let headersEnsuredAt = 0;
const HEADERS_TTL_MS = 60 * 60 * 1000; // re-check at most once per hour

// Ensure standard sheets and headers exist
async function ensureHeaders(sheets: any, spreadsheetId: string) {
  const now = Date.now();
  if (now - headersEnsuredAt < HEADERS_TTL_MS) return; // already done recently

  try {
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetNames = (spreadsheet.data.sheets || []).map((s: any) => s.properties.title);

    const requiredSheets: Record<string, string[]> = {
      Categories: ['id', 'name', 'description', 'createdAt'],
      Products: ['id', 'name', 'category', 'price', 'unit', 'description', 'Image URL', 'createdAt'],
      Orders: ['id', 'createdAt', 'customerName', 'customerPhone', 'location', 'ModeofPayment', 'budget', 'total', 'status'],
      OrderItems: ['id', 'orderId', 'category', 'productName', 'qty', 'unit', 'price', 'subtotal', 'isCustom'],
    };

    const addRequests: any[] = [];
    for (const [title] of Object.entries(requiredSheets)) {
      if (!sheetNames.includes(title)) {
        addRequests.push({
          addSheet: { properties: { title } },
        });
      }
    }

    if (addRequests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: { requests: addRequests },
      });
    }

    // Set headers if empty
    for (const [title, headers] of Object.entries(requiredSheets)) {
      try {
        const res = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${title}!A1:Z1`,
        });
        if (!res.data.values || res.data.values.length === 0) {
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${title}!A1`,
            valueInputOption: 'RAW',
            requestBody: { values: [headers] },
          });
        }
      } catch (sheetErr) {
        console.error(`Error checking headers for sheet "${title}":`, sheetErr);
        // Non-fatal — continue with other sheets
      }
    }

    headersEnsuredAt = Date.now(); // mark success
  } catch (err) {
    console.error('Error ensuring Google Sheets headers:', err);
    // Do NOT update headersEnsuredAt — will retry on next request
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    const { sheets, spreadsheetId } = getGoogleSheetsClient();
    await ensureHeaders(sheets, spreadsheetId);

    if (action === 'listCategories') {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Categories!A:Z',
      });
      const categories = rowsToObjects(res.data.values || []);
      return NextResponse.json({ success: true, data: categories });
    }

    if (action === 'listProducts') {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Products!A:Z',
      });
      const rawProducts = rowsToObjects(res.data.values || []);
      const products = rawProducts.map((p: any) => ({
        ...p,
        price: Number(p.price) || 0,
        // Map the 'Image URL' column header to the 'image' field used by frontend
        image: p['Image URL'] || p.image || '',
      }));
      return NextResponse.json({ success: true, data: products });
    }

    if (action === 'listOrders') {
      const ordersRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Orders!A:Z',
      });
      const itemsRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'OrderItems!A:Z',
      });

      const rawOrders = rowsToObjects(ordersRes.data.values || []);
      const rawItems = rowsToObjects(itemsRes.data.values || []);

      const orders = rawOrders.map((o: any) => {
        const orderItems = rawItems
          .filter((i: any) => i.orderId === o.id)
          .map((i: any) => ({
            ...i,
            qty: Number(i.qty) || 0,
            price: Number(i.price) || 0,
            subtotal: Number(i.subtotal) || 0,
            isCustom: i.isCustom === 'true' || i.isCustom === true,
          }));

        return {
          ...o,
          modeOfPayment: o.ModeofPayment || o.modeOfPayment || o['Mode of Payment'] || 'Cash',
          budget: Number(o.budget) || 0,
          total: Number(o.total) || 0,
          items: orderItems,
        };
      });

      return NextResponse.json({ success: true, data: orders });
    }

    return NextResponse.json({ success: false, error: 'Unknown GET action' }, { status: 400 });
  } catch (error: any) {
    console.error('Google Sheets GET error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { action } = data;

    const { sheets, spreadsheetId } = getGoogleSheetsClient();
    await ensureHeaders(sheets, spreadsheetId);

    if (action === 'addCategory') {
      const newRecord = [
        crypto.randomUUID(),
        data.name || '',
        data.description || '',
        new Date().toISOString(),
      ];
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Categories!A:D',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [newRecord] },
      });
      return NextResponse.json({
        success: true,
        data: { id: newRecord[0], name: newRecord[1], description: newRecord[2], createdAt: newRecord[3] },
      });
    }

    if (action === 'addProduct') {
      const newRecord = [
        crypto.randomUUID(),
        data.name || '',
        data.category || data.categoryId || '',
        data.price || 0,
        data.unit || '',
        data.description || '',
        data.imageUrl || '',
        new Date().toISOString(),
      ];
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Products!A:H',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [newRecord] },
      });
      return NextResponse.json({
        success: true,
        data: {
          id: newRecord[0],
          name: newRecord[1],
          category: newRecord[2],
          price: Number(newRecord[3]),
          unit: newRecord[4],
          description: newRecord[5],
          image: newRecord[6],
          createdAt: newRecord[7],
        },
      });
    }

    if (action === 'deleteCategory' || action === 'deleteProduct') {
      const sheetName = action === 'deleteCategory' ? 'Categories' : 'Products';
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:A`,
      });
      const rows = res.data.values || [];
      const rowIndex = rows.findIndex((row: any[]) => row[0] === data.id);

      if (rowIndex === -1) {
        return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
      }

      // Clear row values
      const sheetRes = await sheets.spreadsheets.get({ spreadsheetId });
      const sheetsList = sheetRes.data.sheets || [];
      const sheetObj = sheetsList.find((s: any) => s.properties.title === sheetName);
      const sheetIdNum = sheetObj?.properties?.sheetId;

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: sheetIdNum,
                  dimension: 'ROWS',
                  startIndex: rowIndex,
                  endIndex: rowIndex + 1,
                },
              },
            },
          ],
        },
      });

      return NextResponse.json({ success: true, message: 'Record deleted' });
    }

    if (action === 'updateProduct') {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Products!A:Z',
      });
      const rows = res.data.values || [];
      const rowIndex = rows.findIndex((row: any[]) => row[0] === data.id);

      if (rowIndex === -1) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }

      const headers = rows[0].map((h: any) => String(h).trim());
      const currentRow = [...rows[rowIndex]];

      if (data.name !== undefined) currentRow[headers.indexOf('name')] = data.name;
      if (data.category !== undefined) currentRow[headers.indexOf('category')] = data.category;
      if (data.price !== undefined) currentRow[headers.indexOf('price')] = data.price;
      if (data.unit !== undefined) currentRow[headers.indexOf('unit')] = data.unit;
      if (data.description !== undefined) currentRow[headers.indexOf('description')] = data.description;
      // Update Image URL column if provided
      const imageUrlColIdx = headers.indexOf('Image URL');
      if (data.imageUrl !== undefined && imageUrlColIdx !== -1) {
        currentRow[imageUrlColIdx] = data.imageUrl;
      }

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Products!A${rowIndex + 1}:H${rowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [currentRow] },
      });

      return NextResponse.json({ success: true, message: 'Product updated' });
    }

    if (action === 'createOrder') {
      const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const createdAt = new Date().toISOString();
      const modeOfPayment = data.modeOfPayment || data.ModeofPayment || data['Mode of Payment'] || 'Cash';

      const orderRow = [
        orderId,
        createdAt,
        data.customerName || '',
        data.customerPhone || '',
        data.location || '',
        modeOfPayment,
        Number(data.budget) || 0,
        Number(data.total) || 0,
        'Pending',
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Orders!A:I',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [orderRow] },
      });

      const itemRows: any[][] = [];
      const createdItems: any[] = [];

      if (Array.isArray(data.items)) {
        data.items.forEach((item: any, idx: number) => {
          const itemId = `i-${orderId}-${idx}`;
          const isCustom = Boolean(item.isCustom);
          const price = Number(item.price) || 0;
          const qty = Number(item.qty) || 0;
          const subtotal = isCustom ? 0 : price * qty;

          itemRows.push([
            itemId,
            orderId,
            item.category || '',
            item.productName || '',
            qty,
            item.unit || '',
            price,
            subtotal,
            isCustom ? 'true' : 'false',
          ]);

          createdItems.push({
            id: itemId,
            orderId,
            category: item.category || '',
            productName: item.productName || '',
            qty,
            unit: item.unit || '',
            price,
            subtotal,
            isCustom,
          });
        });
      }

      if (itemRows.length > 0) {
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'OrderItems!A:I',
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: itemRows },
        });
      }

      const createdOrder = {
        id: orderId,
        createdAt,
        customerName: data.customerName || '',
        customerPhone: data.customerPhone || '',
        location: data.location || '',
        modeOfPayment,
        budget: Number(data.budget) || 0,
        total: Number(data.total) || 0,
        status: 'Pending',
        items: createdItems,
      };

      return NextResponse.json({ success: true, data: createdOrder });
    }

    if (action === 'updateOrderStatus') {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Orders!A:I',
      });
      const rows = res.data.values || [];
      const rowIndex = rows.findIndex((row: any[]) => row[0] === data.id);

      if (rowIndex === -1) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
      }

      const headers = rows[0].map((h: any) => String(h).trim());
      const statusColIndex = headers.indexOf('status');
      if (statusColIndex === -1) {
        return NextResponse.json({ success: false, error: 'Status column not found' }, { status: 500 });
      }

      // Column letter for status
      const colLetter = String.fromCharCode(65 + statusColIndex);
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Orders!${colLetter}${rowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[data.status]] },
      });

      return NextResponse.json({ success: true, message: `Order updated to ${data.status}` });
    }

    return NextResponse.json({ success: false, error: 'Unknown POST action' }, { status: 400 });
  } catch (error: any) {
    console.error('Google Sheets POST error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
