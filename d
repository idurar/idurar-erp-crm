[1mdiff --git a/backend/package-lock.json b/backend/package-lock.json[m
[1mindex 3635c803..73eb533c 100644[m
[1m--- a/backend/package-lock.json[m
[1m+++ b/backend/package-lock.json[m
[36m@@ -1,12 +1,12 @@[m
 {[m
   "name": "idurar-erp-crm",[m
[31m-  "version": "4.0.0",[m
[32m+[m[32m  "version": "4.1.0",[m
   "lockfileVersion": 3,[m
   "requires": true,[m
   "packages": {[m
     "": {[m
       "name": "idurar-erp-crm",[m
[31m-      "version": "4.0.0",[m
[32m+[m[32m      "version": "4.1.0",[m
       "license": "Fair-code License",[m
       "dependencies": {[m
         "@aws-sdk/client-s3": "^3.509.0",[m
[1mdiff --git a/frontend/src/modules/ErpPanelModule/ItemRow.jsx b/frontend/src/modules/ErpPanelModule/ItemRow.jsx[m
[1mindex 5ac84c53..bd049211 100644[m
[1m--- a/frontend/src/modules/ErpPanelModule/ItemRow.jsx[m
[1m+++ b/frontend/src/modules/ErpPanelModule/ItemRow.jsx[m
[36m@@ -59,7 +59,7 @@[m [mexport default function ItemRow({ field, remove, current = null }) {[m
           rules={[[m
             {[m
               required: true,[m
[31m-              message: 'Missing itemName name',[m
[32m+[m[32m              message: 'Not Specified',[m
             },[m
             {[m
               pattern: /^(?!\s*$)[\s\S]+$/, // Regular expression to allow spaces, alphanumeric, and special characters, but not just spaces[m
[36m@@ -77,7 +77,7 @@[m [mexport default function ItemRow({ field, remove, current = null }) {[m
       </Col>[m
       <Col className="gutter-row" span={3}>[m
         <Form.Item name={[field.name, 'quantity']} rules={[{ required: true }]}>[m
[31m-          <InputNumber style={{ width: '100%' }} min={0} onChange={updateQt} />[m
[32m+[m[32m          <InputNumber style={{ width: '100%' }} min={1} onChange={updateQt} />[m
         </Form.Item>[m
       </Col>[m
       <Col className="gutter-row" span={4}>[m
