using System;
using Microsoft.AspNetCore.Http;

namespace ZwajApp.API.Helper
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string Message)
        {
            response.Headers.Add("Application-Error", Message);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }
        public static int CalculteAge(this DateTime dateTime)
        {
            var age = DateTime.Today.Year - dateTime.Year;
            if (dateTime.AddYears(age) > DateTime.Today) age--;
            return age;
        }

    }
}