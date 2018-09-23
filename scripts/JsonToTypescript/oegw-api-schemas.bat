@echo off
CD ./oegw-api-schemas
for %%a in (*.json) do (
json2ts %%a >> ..\oegw-api.d.ts
)