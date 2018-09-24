@echo off
CD ./iqrf-api-schemas
for %%a in (*.json) do (
json2ts %%a >> ..\iqrf-api.d.ts
)