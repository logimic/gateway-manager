@echo off
CD ./schemas
for %%a in (*.json) do (
json2ts %%a >> ..\iqrf-api.d.ts
)