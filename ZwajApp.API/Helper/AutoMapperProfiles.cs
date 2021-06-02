using System.Linq;
using AutoMapper;
using ZwajApp.API.Dtos;
using ZwajApp.API.Models;

namespace ZwajApp.API.Helper
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>()
            .ForMember(dest => dest.PhotoURL,
                       opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(dest => dest.Age, opt => opt.ResolveUsing(scr => scr.DateOfBirth.CalculteAge()));

            CreateMap<User, UserForDetailsDto>()
            .ForMember(dest => dest.PhotoURL,
                       option => option.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(dest => dest.Age, opt => opt.ResolveUsing(scr => scr.DateOfBirth.CalculteAge()));

            CreateMap<Photo, PhotoForDetailsDto>();

            CreateMap<UserForUpdateDto, User>();

            CreateMap<PhotoForCreateDto, Photo>();

            CreateMap<Photo, PhotoForReturnDto>();

            CreateMap<UserForRegisterDto, User>();

            CreateMap<MessgeForCreationDto, Message>().ReverseMap();

            CreateMap<Message, MessageForReturnDto>()
            .ForMember(dest => dest.SenderPhotoUrl,opt => 
                       opt.ResolveUsing(scr => scr.Sender.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(dest => dest.RecipientPhotoUrl,opt => 
                       opt.ResolveUsing(scr => scr.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url));

        }
    }
}